import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { rateLimitMiddleware, limits } from '@/lib/rateLimit';
import { getCollection, Collections } from '@/lib/mongodb';
import { Article } from '@/types';
import { sanitizeHTML } from '@/lib/sanitize';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  // Rate limiting for admin endpoints
  const rateLimitResponse = await rateLimitMiddleware(request, limits.admin);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const { auth, response } = await requireRole('editor');
  
  if (response) {
    return response;
  }

  try {
    const body = await request.json();
    const {
      title,
      summary,
      bodyHtml,
      authorId,
      topics,
      keywords,
      featuredImageId,
      readingTime,
      rating,
      seo,
      locale = 'en',
    } = body;

    // Validate required fields
    if (!title || !summary || !bodyHtml || !authorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Sanitize HTML content
    const sanitizedHtml = sanitizeHTML(bodyHtml);

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const articles = await getCollection<Article>(Collections.ARTICLES);

    // Check if slug already exists
    const existingArticle = await articles.findOne({ slug });
    if (existingArticle) {
      return NextResponse.json(
        { error: 'Article with this title already exists' },
        { status: 409 }
      );
    }

    const newArticle: Omit<Article, '_id'> = {
      slug,
      title,
      summary,
      bodyHtml: sanitizedHtml,
      authorId: new ObjectId(authorId),
      topics: topics || [],
      keywords: keywords || [],
      status: 'draft',
      featuredImageId: featuredImageId ? new ObjectId(featuredImageId) : undefined,
      readingTime,
      rating,
      seo: seo || {
        title,
        description: summary,
        keywords: keywords || [],
      },
      locale,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await articles.insertOne(newArticle as any);

    return NextResponse.json({
      success: true,
      articleId: result.insertedId.toString(),
      slug,
    });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Rate limiting for admin endpoints
  const rateLimitResponse = await rateLimitMiddleware(request, limits.admin);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const { auth, response } = await requireRole('viewer');
  
  if (response) {
    return response;
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const statusParam = searchParams.get('status') || 'draft';
    
    const skip = (page - 1) * limit;
    
    const articles = await getCollection<Article>(Collections.ARTICLES);
    
    // Validate status is a valid ArticleStatus
    const status = ['draft', 'published', 'archived'].includes(statusParam) 
      ? statusParam as 'draft' | 'published' | 'archived'
      : 'draft';
    
    const [items, total] = await Promise.all([
      articles
        .find({ status })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      articles.countDocuments({ status }),
    ]);
    
    return NextResponse.json({
      articles: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
