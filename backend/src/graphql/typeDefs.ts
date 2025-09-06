export const typeDefs = `
type User {
  id: ID!
  fullname: String!
  username: String!
  email: String!
}

type Room {
  id: ID!
  name: String
  isGroup: Boolean!
  users: [User!]!
  messages: [Message!]!
}

type Message {
  id: ID!
  content: String!
  sender: User!
  room: Room!
  createdAt: String!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  likeCount: Int!
  createdAt: String!
  updatedAt: String!
}

type AuthPayload {
  token: String!
  user: User!
}

type Query {
  getUserById(id: ID!): User
  getAllUsers(id: ID!): [User!]!
  getUserByEmailAndPassword(email: String!, password: String!): AuthPayload
  getRoom(id: ID!): Room
  getRoomsForUser(userId: ID!): [Room!]!
  getMessages(roomId: ID!): [Message!]!
  getPostsForUser(userId: ID!): [Post!]!
  getAllPosts: [Post!]!
}

type Mutation {
  createUser(fullname: String!, username: String!, email: String!, password: String!): AuthPayload
  createRoom(name: String, isGroup: Boolean!, memberIds: [ID!]!): Room!
  createMessage(text: String!, roomId: ID!, senderId: ID!): Message!
  addMember(roomId: ID!, userId: ID!): Room!
  createPost(title: String!, content: String!, authorId: ID!): Post!
  likePost(postId: ID!, userId: ID!): Post!
}
`;
