import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { env } from './env';

let connection: Redis | null = null;
let publishQueue: Queue | null = null;

function getRedisConnection(): Redis | null {
  if (connection) {
    return connection;
  }

  if (!env.REDIS_URL) {
    console.warn('⚠️  Redis not configured, queue functionality disabled');
    return null;
  }

  try {
    connection = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
    });

    connection.on('error', (error) => {
      console.error('Redis connection error:', error);
    });

    return connection;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    return null;
  }
}

export function getPublishQueue(): Queue | null {
  if (publishQueue) {
    return publishQueue;
  }

  const redis = getRedisConnection();
  if (!redis) {
    return null;
  }

  publishQueue = new Queue('publish', {
    connection: redis,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: {
        count: 100,
        age: 24 * 3600, // 24 hours
      },
      removeOnFail: {
        count: 1000,
        age: 7 * 24 * 3600, // 7 days
      },
    },
  });

  return publishQueue;
}

export interface PublishJobData {
  articleId: string;
  userId: string;
  scheduledFor?: string;
}

export async function enqueuePublishJob(data: PublishJobData): Promise<string | null> {
  const queue = getPublishQueue();
  
  if (!queue) {
    console.warn('Queue not available, publishing synchronously');
    return null;
  }

  try {
    const job = await queue.add('publish-article', data, {
      priority: 1,
      ...(data.scheduledFor && { delay: new Date(data.scheduledFor).getTime() - Date.now() }),
    });

    return job.id || null;
  } catch (error) {
    console.error('Failed to enqueue publish job:', error);
    throw error;
  }
}

export async function getJobStatus(jobId: string): Promise<{
  status: string;
  progress?: number;
  result?: any;
  error?: string;
} | null> {
  const queue = getPublishQueue();
  
  if (!queue) {
    return null;
  }

  try {
    const job = await queue.getJob(jobId);
    
    if (!job) {
      return null;
    }

    const state = await job.getState();
    
    return {
      status: state,
      progress: job.progress as number | undefined,
      result: job.returnvalue,
      error: job.failedReason,
    };
  } catch (error) {
    console.error('Failed to get job status:', error);
    return null;
  }
}

export async function closeQueue(): Promise<void> {
  if (publishQueue) {
    await publishQueue.close();
    publishQueue = null;
  }

  if (connection) {
    await connection.quit();
    connection = null;
  }
}
