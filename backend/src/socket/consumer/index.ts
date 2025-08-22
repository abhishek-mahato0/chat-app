import { getRedisSubscriber } from "../../redis/index.js";

export async function initRedisConsumer(socketService: any) {
  const subscriber = getRedisSubscriber();
  const io = socketService.IO;

  await subscriber.subscribe("chat-channel", (message: string) => {
    const data = JSON.parse(message);
    console.log("📤 Consumed from Redis:", data);
    io.emit("event:message", data);
  });
}
