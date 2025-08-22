export const mutations = `
  createUser(fullname: String!, username: String!, email: String!, password: String!): User!
  createMessage(roomId: ID!, senderId: ID!, text: String!): Message!
`;
