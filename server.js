const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server, {
    path: "/api/socket",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
      console.log(`User ${socket.id} joined room: ${roomId}`);
      socket.join(roomId);
    });

    socket.on("sendMessage", async (message) => {
      console.log("Message received:", message);

      try {
        const sender = await prisma.user.findUnique({
          where: { id: message.senderId },
        });
        if (!sender) {
          throw new Error(`Sender with ID ${message.senderId} not found`);
        }

        const receiver = await prisma.user.findUnique({
          where: { id: message.receiverId },
        });
        if (!receiver) {
          throw new Error(`Receiver with ID ${message.receiverId} not found`);
        }

        const match = await prisma.match.findUnique({
          where: { id: message.matchId },
        });
        if (!match) {
          throw new Error(`Match with ID ${message.matchId} not found`);
        }

        const savedMessage = await prisma.message.create({
          data: {
            senderId: message.senderId,
            receiverId: message.receiverId,
            matchId: message.matchId,
            content: message.content,
            createdAt: new Date(),
          },
        });

        console.log("Message saved to database:", savedMessage);

        io.to(message.matchId).emit("receiveMessage", savedMessage);
      } catch (error) {
        console.error("Error saving message to database:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
