import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { ObjectId } from 'mongodb';
import { getCollection, Collections } from '../mongodb';
import { Article } from '@/types';
import { env } from '../env';

export interface PublishJobData {
  articleId: string;
  userId: string;
  scheduledFor?: string;
}

let publishWorker: Worker | null = null;

async function processPublishJob(job: Job<PublishJobData>): Promise<{ success: boolean; publishedAt: Date }> {
  const { articleId, userId } = job.data;

  console.log(`Processing publish job for article ${articleId} by user ${userId}`);

  try {
    const articles = await getCollection<Article>(Collections.ARTICLES);
    
    // Update article status to published
    const result = await articles.findOneAndUpdate(
      { _id: new ObjectId(articleId), status: 'draft' },
      {
        $set: {
          status: 'published',
          publishedAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new Error(`Article ${articleId} not found or already published`);
    }

    console.log(`✅ Published article ${articleId}`);

    return {
      success: true,
      publishedAt: result.publishedAt!,
    };
  } catch (error) {
    console.error(`Failed to publish article ${articleId}:`, error);
    throw error;
  }
}

export function startPublishWorker(): Worker | null {
  if (publishWorker) {
    return publishWorker;
  }

  if (!env.REDIS_URL) {
    console.warn('⚠️  Redis not configured, publish worker not started');
    return null;
  }

  try {
    const connection = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
    });

    publishWorker = new Worker('publish', processPublishJob, {
      connection,
      concurrency: 5,
      limiter: {
        max: 10,
        duration: 1000,
      },
    });

    publishWorker.on('completed', (job) => {
      console.log(`Job ${job.id} completed`);
    });

    publishWorker.on('failed', (job, err) => {
      console.error(`Job ${job?.id} failed:`, err);
    });

    console.log('✅ Publish worker started');

    return publishWorker;
  } catch (error) {
    console.error('Failed to start publish worker:', error);
    return null;
  }
}

export async function stopPublishWorker(): Promise<void> {
  if (publishWorker) {
    await publishWorker.close();
    publishWorker = null;
    console.log('Publish worker stopped');
  }
}
