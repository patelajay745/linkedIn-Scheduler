import { Queue } from "bullmq";
import Redis from "ioredis";

const queueConnection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

export const queue = new Queue<{ postId: string; userId: string }>("posts", {
  connection: queueConnection,
  prefix: process.env.APP_NAME + ":",
});
