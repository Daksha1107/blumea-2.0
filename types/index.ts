import { ObjectId } from 'mongodb';

export type UserRole = 'viewer' | 'editor' | 'seo' | 'admin';

export type ArticleStatus = 'draft' | 'published' | 'archived';

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface User {
  _id?: ObjectId;
  email: string;
  name: string;
  role: UserRole;
  passwordHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Author {
  _id?: ObjectId;
  name: string;
  bio: string;
  avatarId?: ObjectId;
  credentials: string[];
  social?: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Topic {
  _id?: ObjectId;
  slug: string;
  title: string;
  description: string;
  parentTopic?: string;
  articleCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Media {
  _id?: ObjectId;
  url: string;
  mimeType: string;
  width?: number;
  height?: number;
  altText: string;
  uploadedBy: ObjectId;
  createdAt: Date;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export interface Article {
  _id?: ObjectId;
  slug: string;
  title: string;
  summary: string;
  bodyHtml: string;
  authorId: ObjectId;
  topics: string[];
  keywords: string[];
  status: ArticleStatus;
  publishedAt?: Date;
  featuredImageId?: ObjectId;
  readingTime?: number;
  rating?: number;
  seo: SEOMetadata;
  locale: string;
  translations?: {
    [locale: string]: ObjectId;
  };
  viewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublishJob {
  _id?: ObjectId;
  articleId: ObjectId;
  status: JobStatus;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  createdAt: Date;
}

export interface StrategyRun {
  _id?: ObjectId;
  generatedAt: Date;
  period: string;
  metricsSummary: {
    totalViews: number;
    topArticles: Array<{ articleId: ObjectId; views: number }>;
    topTopics: Array<{ topic: string; views: number }>;
  };
  actions: Array<{
    type: string;
    target: string;
    reason: string;
  }>;
  status: 'pending' | 'applied' | 'rejected';
  createdAt: Date;
}

// Frontend-specific types
export interface ArticleWithAuthor extends Omit<Article, 'authorId'> {
  author: Author;
}

export interface PopularPost {
  _id: ObjectId;
  slug: string;
  title: string;
  featuredImageId?: ObjectId;
  viewCount: number;
}

export interface CategoryWithCount {
  slug: string;
  title: string;
  count: number;
}
