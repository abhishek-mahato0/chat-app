import { Server, Socket } from "socket.io";
import { prismaClient } from "../lib/db.js";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import { redisClient } from "../redis/index.js";

interface ChatMessage {
  text: string;
  roomId?: string;
  toUserId?: string; // for 1:1 chat
}

export default class SocketService {
  private io: Server;
  private userSockets: Record<string, Set<string>> = {};

  constructor(httpServer?: any) {
    this.io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
      },
      adapter:createAdapter(redisClient)
    });
  }

  public initListeners() {
    this.io.on("connection", (socket: Socket) => {
      const userId = socket.handshake.auth.userId;

      if (userId) {
        if (!this.userSockets[userId]) this.userSockets[userId] = new Set();
        this.userSockets[userId].add(socket.id);
        socket.data.userId = userId;
      }

      // --- User online event ---
      socket.on("user:online", (userId: string) => {
        if (!this.userSockets[userId]) this.userSockets[userId] = new Set();
        this.userSockets[userId].add(socket.id);
        socket.data.userId = userId;
        const onlineUsers = Object.keys(this.userSockets); // all userIds with active sockets
        this.io.emit("online:users", onlineUsers);

      });

      // --- Join room (1:1 or group) ---
      socket.on(
        "join:room",
        async ({
          roomId,
          toUserId,
        }: {
          roomId?: string;
          toUserId?: string;
        }) => {
          const userId = socket.handshake.auth.userId;
          if (!userId || (!roomId && !toUserId)) return;

          let room;

          // 1:1 chat
          if (!roomId && toUserId) {
            room = await prismaClient.room.findFirst({
              where: {
                isGroup: false,
                users: { some: { userId } },
                AND: { users: { some: { userId: toUserId } } },
              },
              include: { users: true },
            });

            if (!room) {
              room = await prismaClient.room.create({
                data: {
                  isGroup: false,
                  users: {
                    create: [
                      { user: { connect: { id: userId } } },
                      { user: { connect: { id: toUserId } } },
                    ],
                  },
                },
                include: { users: true },
              });
            }
          } else if (roomId) {
            // Group chat
            room = await prismaClient.room.findUnique({
              where: { id: roomId },
              include: { users: true },
            });
            if (!room?.id) return;
          }

          if (!room?.id) return;

          const finalRoomId = room.id;
          socket.join(finalRoomId);

          // Fetch previous messages
          const previousMessages = await prismaClient.message.findMany({
            where: { roomId: finalRoomId },
            orderBy: { createdAt: "asc" },
            include: {
              sender: { select: { id: true, fullname: true, username:true } },
            },
          });

          socket.emit("previous:messages", previousMessages);
        }
      );

      // --- Leave room ---
      socket.on("room:leave", (roomId: string) => {
        socket.leave(roomId);
      });

      // --- Handle messages ---
      socket.on(
        "event:message",
        async ({ text, roomId, toUserId }: ChatMessage) => {
          const userId = socket.handshake.auth.userId;
          if (!userId || (!roomId && !toUserId)) return;

          let room;

          // 1:1 chat
          if (!roomId && toUserId) {
            room = await prismaClient.room.findFirst({
              where: {
                isGroup: false,
                users: { some: { userId } },
                AND: { users: { some: { userId: toUserId } } },
              },
              include: { users: true },
            });

            if (!room) {
              room = await prismaClient.room.create({
                data: {
                  isGroup: false,
                  users: {
                    create: [
                      { user: { connect: { id: userId } } },
                      { user: { connect: { id: toUserId } } },
                    ],
                  },
                },
                include: { users: true },
              });
            }
          } else if (roomId) {
            // Group chat
            room = await prismaClient.room.findUnique({
              where: { id: roomId },
              include: { users: true },
            });
            if (!room) return;
          }

          if (!room?.id) return;
          const finalRoomId = room.id;
          room.users
          .filter((m: any) => m.userId !== userId)
          .forEach((member: any) => {
            const sockets = this.userSockets[member.userId] || [];
            sockets.forEach((sockId) => {
                this.io.to(sockId).emit("event:message", {
                  from: userId,
                  roomId: finalRoomId,
                  text,
                  createdAt: new Date(),
                });
              });
            });

          // --- Save message asynchronously ---
          await prismaClient.message.create({
            data: {
              text,
              sender: { connect: { id: userId } },
              room: { connect: { id: finalRoomId } },
            },
          });
        }
      );

      // --- Disconnect ---
      socket.on("disconnect", () => {
        const userId = socket.data.userId;
        if (userId && this.userSockets[userId]) {
          this.userSockets[userId].delete(socket.id);
          if (this.userSockets[userId].size === 0)
            delete this.userSockets[userId];
        }
      });
    });
  }

  get IO() {
    return this.io;
  }
}
