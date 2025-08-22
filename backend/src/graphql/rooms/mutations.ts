export const mutations = `
  createRoom(name: String!, isGroup: Boolean!, memberIds: [ID!]!): Room!
  createMessage(roomId: ID!, senderId: ID!, text: String!): Message!
`;
