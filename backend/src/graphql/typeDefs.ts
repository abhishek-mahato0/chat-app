export const typeDefs = `
type User {
  id: ID!
  firstName: String!
  lastName: String!
  email: String!
}

type Room {
  id: ID!
  name: String
  isGroup: Boolean!
  members: [User!]!
  messages: [Message!]!
}

type Message {
  id: ID!
  content: String!
  sender: User!
  room: Room!
  createdAt: String!
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
}

type Mutation {
  createUser(firstName: String!, lastName: String!, email: String!, password: String!): AuthPayload
  createRoom(name: String, isGroup: Boolean!, memberIds: [ID!]!): Room!
  createMessage(content: String!, roomId: ID!, senderId: ID!): Message!
}
`;
