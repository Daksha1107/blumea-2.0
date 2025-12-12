import { connectToDatabase, Collections } from '../lib/mongodb';

async function migrate() {
  console.log('🔧 Starting database migration...');

  try {
    const { db } = await connectToDatabase();

    // Create text indexes for search
    console.log('Creating text index on articles...');
    await db.collection(Collections.ARTICLES).createIndex(
      {
        title: 'text',
        summary: 'text',
        bodyHtml: 'text',
        keywords: 'text',
      },
      {
        name: 'article_text_search',
        weights: {
          title: 10,
          keywords: 5,
          summary: 3,
          bodyHtml: 1,
        },
      }
    );

    // Create unique index on article slug
    console.log('Creating unique index on article slug...');
    await db.collection(Collections.ARTICLES).createIndex(
      { slug: 1, locale: 1 },
      { unique: true, name: 'article_slug_locale_unique' }
    );

    // Create indexes on article fields
    console.log('Creating indexes on article fields...');
    await db.collection(Collections.ARTICLES).createIndex({ status: 1, publishedAt: -1 });
    await db.collection(Collections.ARTICLES).createIndex({ authorId: 1 });
    await db.collection(Collections.ARTICLES).createIndex({ topics: 1 });
    await db.collection(Collections.ARTICLES).createIndex({ locale: 1 });
    await db.collection(Collections.ARTICLES).createIndex({ viewCount: -1 });

    // Create unique index on topic slug
    console.log('Creating unique index on topic slug...');
    await db.collection(Collections.TOPICS).createIndex(
      { slug: 1 },
      { unique: true, name: 'topic_slug_unique' }
    );

    // Create unique index on user email
    console.log('Creating unique index on user email...');
    await db.collection(Collections.USERS).createIndex(
      { email: 1 },
      { unique: true, name: 'user_email_unique' }
    );

    // Create indexes on publish jobs
    console.log('Creating indexes on publish jobs...');
    await db.collection(Collections.PUBLISH_JOBS).createIndex({ articleId: 1 });
    await db.collection(Collections.PUBLISH_JOBS).createIndex({ status: 1, createdAt: -1 });

    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
