import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCollection, Collections } from '@/lib/mongodb';
import { Article } from '@/types';
import { requireRole } from '@/lib/rbac';
import { sanitizeHtml } from '@/lib/sanitize';
import { ObjectId } from 'mongodb';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !requireRole(session.user.role, 'viewer')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const articles = await getCollection<Article>(Collections.ARTICLES);
    const article = await articles.findOne({ _id: new ObjectId(params.id) });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !requireRole(session.user.role, 'editor')) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Editor role required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const articles = await getCollection<Article>(Collections.ARTICLES);

    // Find existing article
    const existingArticle = await articles.findOne({ _id: new ObjectId(params.id) });
    if (!existingArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Sanitize HTML if provided
    const updateData: any = {
      ...body,
      updatedAt: new Date(),
    };

    if (body.bodyHtml) {
      updateData.bodyHtml = sanitizeHtml(body.bodyHtml);
    }

    // Convert string IDs to ObjectId
    if (body.authorId) {
      updateData.authorId = new ObjectId(body.authorId);
    }
    if (body.featuredImageId) {
      updateData.featuredImageId = new ObjectId(body.featuredImageId);
    }

    // Update article
    await articles.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !requireRole(session.user.role, 'admin')) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Admin role required' },
        { status: 403 }
      );
    }

    const articles = await getCollection<Article>(Collections.ARTICLES);

    // Soft delete by setting status to archived
    const result = await articles.updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $set: { 
          status: 'archived',
          updatedAt: new Date(),
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
