export const queries = `
  getRoom(id: ID!): Room
  getRoomsForUser(userId: ID!): [Room!]!
  getMessages(roomId: ID!): [Message!]!
`;
