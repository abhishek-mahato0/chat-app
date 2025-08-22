export const queries = `
  getUserById(id: ID!): User
  getAllUsers(id: ID!): [User!]!
  getUserByEmailAndPassword(email: String!, password: String!): User
  getMessages(roomId: ID!): [Message!]!
`;