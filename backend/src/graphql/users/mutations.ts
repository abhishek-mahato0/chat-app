export const mutations = `
  createUser(firstName: String!, lastName: String!, email: String!, password: String!): User!
  createMessage(roomId: ID!, senderId: ID!, content: String!): Message!
`;
