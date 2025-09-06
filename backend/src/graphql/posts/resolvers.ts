// getPostsForUser(userId: ID!): [Post!]!
// getAllPosts(): [Post!]!

//  createPost(title: String!, content: String!, authorId: ID!): Post!
//  likePost(postId: ID!, userId: ID!): Post!

import { getPrismaClient } from "../../lib/db.js";

const prismaClient = getPrismaClient();
export const resolvers = {
  queries: {
    getAllPosts: async (_parent: any, _args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");

      const userId = context.user.userId;

      // Get friend IDs
      const friends = await prismaClient.friend.findMany({
        where: { userId },
        select: { friendId: true },
      });

      const friendIds = friends.map((f: any) => f.friendId);

      // Feed = user's own posts + friends' posts
      return prismaClient.post.findMany({
        where: {
          OR: [{ authorId: userId }, { authorId: { in: friendIds } }],
        },
        include: {
          author: true, // user info
          likes: true, // who liked it
        },
        orderBy: { createdAt: "desc" },
      });
    },
    getPostsForUser: async (_: any, { userId }: { userId: string }) => {
      return await prismaClient.post.findMany({
        where: {
          authorId: userId,
        },
      });
    },
  },
  mutations: {
    createPost: async (
      _: any,
      { title, content }: { title: string; content: string },
      context: any
    ) => {
      if (!context.user) throw new Error("Not authenticated");

      const post = await prismaClient.post.create({
        data: {
          title,
          content,
          authorId: context.user.userId,
        },
      });

      return post;
    },

    likePost: async (
      _: any,
      { postId, userId }: { postId: string; userId: string },
      context: any
    ) => {
      if (!context.user) throw new Error("Not authenticated");

      const post = await prismaClient.post.findUnique({
        where: { id: postId },
      });
      if (!post) throw new Error("Post not found");

      const like = await prismaClient.like.create({
        data: {
          userId: userId,
          postId: post.id,
        },
      });

      return like;
    },
  },
};
