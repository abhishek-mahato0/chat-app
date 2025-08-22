// import { createClient, RedisClientType } from "redis";

// let pubClient: RedisClientType;
// let subClient: RedisClientType;

// export async function connectRedis() {
//   pubClient = createClient({
//     url: "redis://localhost:6379",
//   });

//   subClient = createClient({
//     url: "redis://localhost:6379",
//   });

//   pubClient.on("error", (err) => console.log("Error pub", err));
//   subClient.on("error", (err) => console.log("Error sub", err));

//   pubClient.connect().then(() => console.log("connected to pub redis server"));
//   subClient.connect().then(() => console.log("connected to sub redis server"));

//   return { pubClient, subClient };
// }

// export function getRedisPublisher() {
//   return pubClient;
// }

// export function getRedisSubscriber() {
//   return subClient;
// }
import { Redis } from "ioredis";
export const redisClient = new Redis(process.env.REDIS_URL || "");