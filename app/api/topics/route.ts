import { NextResponse } from 'next/server';
import { getCollection, Collections } from '@/lib/mongodb';
import { Topic, Article } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const topicsCollection = await getCollection<Topic>(Collections.TOPICS);
    const articlesCollection = await getCollection<Article>(Collections.ARTICLES);
    
    const topics = await topicsCollection.find().toArray();
    
    // Get article count for each topic
    const topicsWithCounts = await Promise.all(
      topics.map(async (topic) => {
        const count = await articlesCollection.countDocuments({
          status: 'published',
          topics: topic.slug,
        });
        
        return {
          slug: topic.slug,
          title: topic.title,
          description: topic.description,
          count,
        };
      })
    );
    
    return NextResponse.json({
      topics: topicsWithCounts.filter((t) => t.count > 0),
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    );
  }
}
