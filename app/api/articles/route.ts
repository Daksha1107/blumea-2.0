import { NextRequest, NextResponse } from 'next/server';
import { getCollection, Collections } from '@/lib/mongodb';
import { Article } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const topic = searchParams.get('topic');
    const sort = searchParams.get('sort') || 'newest';
    
    const skip = (page - 1) * limit;
    
    const articles = await getCollection<Article>(Collections.ARTICLES);
    
    // Build query
    const query: any = { status: 'published' };
    if (topic) {
      query.topics = topic;
    }
    
    // Build sort
    let sortQuery: any = {};
    switch (sort) {
      case 'newest':
        sortQuery = { publishedAt: -1 };
        break;
      case 'popular':
        sortQuery = { viewCount: -1 };
        break;
      case 'oldest':
        sortQuery = { publishedAt: 1 };
        break;
      default:
        sortQuery = { publishedAt: -1 };
    }
    
    const [items, total] = await Promise.all([
      articles
        .find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .toArray(),
      articles.countDocuments(query),
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
