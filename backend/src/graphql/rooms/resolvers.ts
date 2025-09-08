import { getPrismaClient } from "../../lib/db.js";

// getRoom(id: ID!): Room
// getRoomsForUser(userId: ID!): [Room!]!
// getMessages(roomId: ID!): [Message!]!

const prismaClient = getPrismaClient();

export const resolvers = {
  queries: {
    getRoom: (_: any, { id }: { id: string }) =>
      prismaClient.room.findUnique({
        where: { id },
        include: { users: true, messages: true },
      }),

    getRoomsForUser: async (_: any, { userId }: { userId: string }) => {
      const rooms = await prismaClient.room.findMany({
        where: { isGroup: true, users: { some: { userId } } },
        include: {
          users: { include: { user: true } },
          latestMessage: {
            include: { sender: true },
          },
        },
      });

      console.log({ rooms });
      // attach unreadCount
      return Promise.all(
        rooms.map(async (room: any) => {
          const roomUser = await prismaClient.roomUser.findFirst({
            where: { roomId: room.id, userId },
            select: { lastSeenMessageId: true },
          });

          let unreadCount = 0;

          if (roomUser?.lastSeenMessageId) {
            const lastSeenMessageCreatedAt =
              await prismaClient.message.findUnique({
                where: { id: roomUser?.lastSeenMessageId },
                select: { createdAt: true },
              });
            if (lastSeenMessageCreatedAt) {
              unreadCount = await prismaClient.message.count({
                where: {
                  roomId: room.id,
                  createdAt: {
                    gt: lastSeenMessageCreatedAt.createdAt,
                  },
                },
              });
            }
          }

          return {
            ...room,
            users: room.users.map((ru: any) => ru?.user),
            unreadCount,
          };
        })
      );
    },

    getMessages: (_: any, { roomId }: { roomId: string }) =>
      prismaClient.message.findMany({
        where: { roomId },
        orderBy: { createdAt: "asc" },
      }),
  },

  mutations: {
    createRoom: async (
      _: any,
      {
        name,
        isGroup,
        memberIds,
      }: { name?: string; isGroup: boolean; memberIds: string[] }
    ) => {
      const room = await prismaClient.room.create({
        data: {
          name: name ?? null,
          isGroup,
          users: {
            create: memberIds.map((id) => ({
              user: { connect: { id } },
            })),
          },
        },
        include: {
          users: { include: { user: true } },
        },
      });
      return room;
    },

    createMessage: async (
      _: any,
      {
        roomId,
        senderId,
        text,
      }: { roomId: string; senderId: string; text: string }
    ) => {
      const message = await prismaClient.message.create({
        data: { roomId, senderId, text },
      });
      await prismaClient.room.update({
        where: { id: roomId },
        data: { latestMessageId: message.id },
      });

      return message;
    },
  },
};
