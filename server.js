const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");
//Not wholly sure why, but importing the prismaclient from the lib folder causes issues, so reimporting it here
const prisma = new PrismaClient();
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  //Socket.io server creation with cors hardcoded to localhost:3000
  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: {
      origin: "localhost:3000",
    },
  });

  io.engine.on("connection_error", (err) => {
    console.log(err.req); // the request object
    console.log(err.code); // the error code, for example 1
    console.log(err.message); // the error message, for example "Session ID unknown"
    console.log(err.context); // some additional error context
  });

  io.on("connection", async (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("Joining match session", async (newMatchId) => {
      // A cumbersome way to have each client connected to one room at a time, there's definitely a simpler way for this whole system to work, probably something like chats
      // could just be connecting two clients to each other in some way I'm unfamiliar with.
      const rooms = io.sockets.adapter.sids[socket.id];
      if (rooms) {
        rooms.forEach((room) => {
          socket.leave(room);
        });
      }
      console.log("Joining match session:", newMatchId);
      socket.room = newMatchId; // Store the current room in the socket object
      socket.join(newMatchId);
    });

    //So this feels really innefficient, but it works for now and I can come back and optimize if ya'll care :)
    socket.on("message", (message, currentMatch, currentUser) => {
      console.log(
        "Message received by server:",
        message,
        currentMatch,
        currentUser,
      );
      console.log("Socket room:", socket.room);
      // Save the message to the database using Prisma
      if (message && currentMatch && currentUser) {
        prisma.message
          .create({
            data: {
              content: message,
              match: { connect: { id: currentMatch.id } },
              user: { connect: { id: currentUser.id } },
            },
          })
          .then(() => {
            console.log("Message saved to database successfully.");
          })
          .catch((error) => {
            console.error("Error saving message to database:", error);
          });
      } else {
        console.error(
          "Invalid data: message, matchId, and userId are required.",
        );
      }
      // Broadcast the message to all connected clients
      if (socket.room) {
        socket.to(socket.room).emit("messageResponse", message);
      } else {
        console.error("socket.room is not defined. Cannot emit message.");
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
