import express from "express";
import { expressMiddleware } from "@as-integrations/express5";
import { createServer } from "http";
import SocketService from "./socket/index.js";
import { connectRedis } from "./redis/index.js";
import cors from "cors";
import { initRedisConsumer } from "./socket/consumer/index.js";
import bodyParser from "body-parser";
import createGQLServer from "./graphql/index.js";

async function init() {
  const socketService = new SocketService();
  const app = express();

  const PORT = Number(process.env.PORT || 8080);

  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

  app.use(express.json());

  const httpServer = createServer(app);
  socketService.IO.attach(httpServer);

  const gqlServer = await createGQLServer();

  app.get("/", (req, res) => {
    return res.json({ message: "hjhjjh home" });
  });

  app.use("/graphql", bodyParser.json(), expressMiddleware(gqlServer));

  httpServer.listen(PORT, () => {
    console.log(`Connected to port ${PORT}`);
  });
  await connectRedis();
  socketService.initListeners();
  await initRedisConsumer(socketService);
}

init();
