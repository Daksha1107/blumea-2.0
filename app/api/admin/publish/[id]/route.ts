import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { enqueuePublishJob } from '@/lib/queue';
import { getCollection, Collections } from '@/lib/mongodb';
import { Article } from '@/types';
import { ObjectId } from 'mongodb';
import { logger } from '@/lib/logger';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Require editor role or higher
  const { auth, response } = await requireRole('editor');
  
  if (response) {
    return response;
  }

  try {
    const articleId = params.id;

    // Validate article exists and is in draft status
    const articles = await getCollection<Article>(Collections.ARTICLES);
    const article = await articles.findOne({
      _id: new ObjectId(articleId),
      status: 'draft',
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found or already published' },
        { status: 404 }
      );
    }

    // Enqueue publish job
    const jobId = await enqueuePublishJob({
      articleId,
      userId: (auth.user as any).id,
    });

    if (!jobId) {
      // Queue not available, publish synchronously
      await articles.updateOne(
        { _id: new ObjectId(articleId) },
        {
          $set: {
            status: 'published',
            publishedAt: new Date(),
            updatedAt: new Date(),
          },
        }
      );

      logger.info('Article published synchronously', { articleId });

      return NextResponse.json({
        success: true,
        jobId: null,
        message: 'Article published successfully',
      });
    }

    logger.info('Publish job enqueued', { articleId, jobId });

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Article queued for publishing',
    });
  } catch (error) {
    logger.error('Publish error', error);
    return NextResponse.json(
      { error: 'Failed to publish article' },
      { status: 500 }
    );
  }
}
