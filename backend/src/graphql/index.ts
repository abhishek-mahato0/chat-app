import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./typeDefs.js";
import { resolvers } from "./resolvers.js";

async function createGQLServer() {
  const gqlServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await gqlServer.start();
  return gqlServer;
}

export default createGQLServer;
