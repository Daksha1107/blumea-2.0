import { NextRequest, NextResponse } from 'next/server';
import { getCollection, Collections } from '@/lib/mongodb';
import { Article, Author, ArticleWithAuthor } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const articles = await getCollection<Article>(Collections.ARTICLES);
    const authors = await getCollection<Author>(Collections.AUTHORS);

    // Get latest 50 published articles
    const latestArticles = await articles
      .find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(50)
      .toArray();

    // Get authors
    const authorIds = [...new Set(latestArticles.map((a) => a.authorId))];
    const authorsMap = new Map<string, Author>();

    if (authorIds.length > 0) {
      const authorsList = await authors
        .find({ _id: { $in: authorIds } })
        .toArray();

      authorsList.forEach((author) => {
        authorsMap.set(author._id!.toString(), author);
      });
    }

    // Build RSS feed
    const baseUrl = process.env.NEXTAUTH_URL || 'https://blumea.com';
    const buildDate = new Date().toUTCString();

    const rssItems = latestArticles
      .map((article) => {
        const author = authorsMap.get(article.authorId.toString());
        const imageUrl = article.featuredImageId
          ? `${baseUrl}/api/media/${article.featuredImageId}`
          : `${baseUrl}/og-image.jpg`;

        return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}/blog/${article.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${article.slug}</guid>
      <description><![CDATA[${article.summary}]]></description>
      <pubDate>${article.publishedAt?.toUTCString()}</pubDate>
      <author>${author?.name || 'Unknown Author'}</author>
      <category>${article.topics[0]}</category>
      <enclosure url="${imageUrl}" type="image/jpeg" />
    </item>`;
      })
      .join('\n');

    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SKINCARE &amp; WELLNESS</title>
    <link>${baseUrl}</link>
    <description>Expert skincare reviews, guides, and wellness tips</description>
    <language>en</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

    return new NextResponse(rssFeed, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('RSS generation error:', error);
    return NextResponse.json({ error: 'Failed to generate RSS feed' }, { status: 500 });
  }
}
