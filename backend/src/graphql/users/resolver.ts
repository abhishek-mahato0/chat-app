import { getPrismaClient } from "../../lib/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const prismaClient = getPrismaClient();
export const resolvers = {
  queries: {
    getUserById: async (_: any, { id }: { id: string }) => {
      return prismaClient.user.findUnique({ where: { id } });
    },
    getAllUsers: async (_: any, { id }: { id: string }) => {
      return prismaClient.user.findMany({
        where: {
          NOT: {
            id: id,
          },
        },
      });
    },
    getUserByEmailAndPassword: async (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      const user = await prismaClient.user.findUnique({ where: { email } });
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid password");

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return { token, user };
    },

    getMessages: async (_: any, { roomId }: { roomId: string }) => {
      return prismaClient.message.findMany({
        where: { roomId },
        orderBy: { createdAt: "asc" },
      });
    },
  },

  mutations: {
    createUser: async (
      _: any,
      {
        fullname,
        username,
        email,
        password,
      }: {
        fullname: string;
        username: string;
        email: string;
        password: string;
      }
    ) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await prismaClient.user.create({
        data: { fullname, username , email, password: hashedPassword, salt },
      });
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return { token, user };
    },

    createMessage: async (
      _: any,
      {
        content,
        roomId,
        senderId,
      }: { content: string; roomId: string; senderId: string }
    ) => {
      return prismaClient.message.create({
        data: { text: content, roomId, senderId },
      });
    },
  },
};
