import { NextRequest, NextResponse } from 'next/server';
import { searchArticles } from '@/lib/search';
import { rateLimitMiddleware } from '@/lib/rateLimit';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResponse = await rateLimitMiddleware(request, { requests: 20, window: '60 s' });
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const topics = searchParams.get('topics')?.split(',').filter(Boolean);
    const locale = searchParams.get('locale') || 'en';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const skip = Math.max(parseInt(searchParams.get('skip') || '0'), 0);

    if (!query && !topics) {
      return NextResponse.json(
        { error: 'Query or topics parameter is required' },
        { status: 400 }
      );
    }

    const results = await searchArticles({
      query,
      topics,
      locale,
      limit,
      skip,
    });

    logger.info('Search executed', {
      query,
      topics,
      resultsCount: results.articles.length,
    });

    return NextResponse.json(results);
  } catch (error) {
    logger.error('Search error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
