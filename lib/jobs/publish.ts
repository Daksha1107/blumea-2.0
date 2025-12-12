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
    
    // Find article and validate it can be published
    const existingArticle = await articles.findOne({ 
      _id: new ObjectId(articleId), 
      status: { $in: ['draft', 'scheduled'] }
    });
    
    if (!existingArticle) {
      throw new Error(`Article ${articleId} not found or already published`);
    }
    
    // Update article status to published
    const result = await articles.findOneAndUpdate(
      { _id: new ObjectId(articleId) },
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
      throw new Error(`Failed to update article ${articleId}`);
    }

    console.log(`✅ Published article ${articleId}`);

    // Call revalidation webhook to update Next.js cache
    try {
      const revalidationSecret = env.REVALIDATION_SECRET || 'dev-secret';
      const baseUrl = env.NEXTAUTH_URL || 'http://localhost:3000';
      
      const revalidateResponse = await fetch(`${baseUrl}/api/hooks/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paths: [`/blog/${result.slug}`, '/'],
          secret: revalidationSecret,
        }),
      });

      if (!revalidateResponse.ok) {
        console.error('Failed to revalidate paths:', await revalidateResponse.text());
      } else {
        console.log(`✅ Revalidated paths for article ${articleId}`);
      }
    } catch (revalidateError) {
      console.error('Error calling revalidation webhook:', revalidateError);
      // Don't fail the job if revalidation fails
    }

    // Log to audit trail
    try {
      const auditLogs = await getCollection(Collections.AUDIT_LOGS);
      await auditLogs.insertOne({
        userId: new ObjectId(userId),
        action: 'publish_article',
        targetType: 'article',
        targetId: new ObjectId(articleId),
        changes: { status: 'published', publishedAt: result.publishedAt },
        createdAt: new Date(),
      });
    } catch (auditError) {
      console.error('Error logging to audit trail:', auditError);
      // Don't fail the job if audit logging fails
    }

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
