import express from "express";
import { expressMiddleware } from "@as-integrations/express5";
import { createServer } from "http";
import SocketService from "./socket/index.js";
// import { connectRedis } from "./redis/index.js";
import cors from "cors";
// import { initRedisConsumer } from "./socket/consumer/index.js";
import bodyParser from "body-parser";
import createGQLServer from "./graphql/index.js";
import jwt from "jsonwebtoken";
import { getPrismaClient } from "./lib/db.js";

async function init() {
  const socketService = new SocketService();
  const app = express();
  const JWT_SECRET = process.env.JWT_SECRET || "secret";

    try {
    // Check DB connection
    await getPrismaClient().$connect();
    console.log("✅ Database connected successfully!");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1); // Stop the server if DB isn't connected
  }

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
    return res.json({ message: "welcome home" });
  });

  app.use("/graphql", bodyParser.json(), expressMiddleware(gqlServer, {
    context: async ({ req }) => {
      const token = req.headers.authorization?.replace("Bearer ", "");
      try {
        if (!token) throw new Error("Unauthorized");

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const user = await getPrismaClient().user.findUnique({ where: { id: decoded.userId } });
        if (!user) throw new Error("User not found");

        return { user };
      } catch (error) {
        console.error("Error verifying token:", error);
        throw new Error("Unauthorized");
      }
    },
  }));

  httpServer.listen(PORT, () => {
    console.log(`Connected to port ${PORT}`);
  });
  // await connectRedis();
  socketService.initListeners();
  // await initRedisConsumer(socketService);
}

init();
