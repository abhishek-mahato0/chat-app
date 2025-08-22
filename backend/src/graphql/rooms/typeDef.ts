export const typeDefs = `
type Room {
  id: ID!
  name: String
  isGroup: Boolean!
  members: [User!]!
  messages: [Message!]!
}

type Message {
  id: ID!
  text: String!
  sender: User!
  room: Room!
  createdAt: String!
}

type Query {
  getRoom(id: ID!): Room
  getRoomsForUser(userId: ID!): [Room!]!
  getMessages(roomId: ID!): [Message!]!
}

type Mutation {
  createRoom(name: String!, isGroup: Boolean!, memberIds: [ID!]!): Room!
  createMessage(roomId: ID!, senderId: ID!, text: String!): Message!
}
`;
