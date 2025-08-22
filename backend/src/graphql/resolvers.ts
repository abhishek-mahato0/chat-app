import { Users } from "./users/index.js";
import { Rooms } from "./rooms/index.js";

export const resolvers = {
  Query: {
    ...Users.resolvers.queries,
    ...Rooms.resolvers.queries,
  },
  Mutation: {
    ...Users.resolvers.mutations,
    ...Rooms.resolvers.mutations,
  },
};
