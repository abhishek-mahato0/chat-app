import { prismaClient } from "../../lib/db.js";

export const resolvers = {
  queries: {
    getRoom: (_: any, { id }: { id: string }) =>
      prismaClient.room.findUnique({
        where: { id },
        include: { users: true, messages: true },
      }),

    getRoomsForUser: (_: any, { userId }: { userId: string }) =>
      prismaClient.room.findMany({
        where: { users: { some: { userId } } },
        include: { users: true, messages: true },
      }),

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
          users: { create: memberIds.map((id) => ({ userId: id })) },
        },
        include: { users: true },
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
