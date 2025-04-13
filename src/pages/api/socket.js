import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let io;

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Setting up Socket.IO server...");
    io = new Server(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    res.socket.server.io = io;

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

      socket.on("typing", ({ matchId, senderId }) => {
        console.log(`User ${senderId} is typing in room: ${matchId}`);
        socket.to(matchId).emit("typing", { senderId });
      });

      socket.on("stopTyping", ({ matchId, senderId }) => {
        console.log(`User ${senderId} stopped typing in room: ${matchId}`);
        socket.to(matchId).emit("stopTyping", { senderId });
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
      });
    });
  } else {
    console.log("Socket.IO server already running.");
  }

  res.end();
}
