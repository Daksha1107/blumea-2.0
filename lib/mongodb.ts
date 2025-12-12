import { MongoClient, Db, Document } from 'mongodb';
import { env } from './env';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (client && db) {
    return { client, db };
  }

  try {
    client = new MongoClient(env.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
    });

    await client.connect();
    db = client.db(env.MONGODB_DBNAME);

    console.log('✅ Connected to MongoDB');

    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export async function getDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  const { db: database } = await connectToDatabase();
  return database;
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
}

// Collection helpers
export async function getCollection<T extends Document>(name: string) {
  const database = await getDatabase();
  return database.collection<T>(name);
}

// Collection names
export const Collections = {
  ARTICLES: 'articles',
  AUTHORS: 'authors',
  TOPICS: 'topics',
  MEDIA: 'media',
  USERS: 'users',
  PUBLISH_JOBS: 'publishJobs',
  STRATEGY_RUNS: 'strategyRuns',
  AUDIT_LOGS: 'auditLogs',
} as const;
