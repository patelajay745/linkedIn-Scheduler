import { PostStatus } from "@/generated/prisma/enums";
import prisma from "@/shared/lib/prisma";
import { linkedInService } from "@/shared/services/linkedin";
import { ApiError } from "@/shared/utils/apiError";
import { UnrecoverableError, Worker } from "bullmq";
import Redis from "ioredis";

const queueConnection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

const worker = new Worker<{ postId: string; userId: string }>(
  "posts",
  async (job) => {
    try {
      await linkedInService.publishPost(job.data.postId, job.data.userId);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode < 500) {
        throw new UnrecoverableError(error.message);
      }

      throw error;
    }
  },
  {
    connection: queueConnection,
  }
);

worker.on("failed", async (job, err) => {
  if (!job) return;
  await prisma.post.update({
    where: {
      id: job.data.postId,
    },
    data: {
      status: PostStatus.FAILED,
    },
  });
});

worker.on("error", (err) => {
  console.error(err);
});
