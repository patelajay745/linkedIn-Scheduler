import { queue } from "../lib/queue";

class SchedulerService {
  async enqueuePost(
    postId: string,
    userId: string,
    scheduledAt: string
  ): Promise<string> {
    const delay = new Date(scheduledAt).getTime() - Date.now();

    const job = await queue.add(
      "publish",
      { postId, userId },
      {
        delay,
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      }
    );

    return job.id!;
  }

  async cancelPost(bullJobId: string): Promise<void> {
    const job = await queue.getJob(bullJobId);

    if (job) {
      await job.remove();
    }
  }
}

export const schedulerService = new SchedulerService();
