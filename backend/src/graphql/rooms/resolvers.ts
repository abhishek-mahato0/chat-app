import { prismaClient } from "../../lib/db.js";

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
          users: { include: { user: true } }, // include User object
        },
      });

      // Map junction table to return users array
      const mappedRooms = rooms.map((room) => ({
        ...room,
        users: room.users
          .map((ru) => ru.user) // extract the actual user
          .filter(Boolean), // remove null users
      }));

      return mappedRooms;
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
    ) => prismaClient.message.create({ data: { roomId, senderId, text } }),
  },
};
