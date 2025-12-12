import { ObjectId } from 'mongodb';

export type UserRole = 'viewer' | 'contributor' | 'editor' | 'seo' | 'publisher' | 'admin';

export type ArticleStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type UserStatus = 'active' | 'disabled';

export interface User {
  _id?: ObjectId;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  passwordHash?: string;
  lastLogin?: Date;
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
  cdnUrl?: string;
  mimeType: string;
  width?: number;
  height?: number;
  altText: string;
  caption?: string;
  credit?: string;
  source: 'upload' | 'generated';
  moderationStatus: 'pending' | 'approved' | 'rejected';
  uploadedBy: ObjectId;
  deletedAt?: Date;
  createdAt: Date;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  primaryKeyword?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noindex?: boolean;
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
  scheduledFor?: Date;
  featuredImageId?: ObjectId;
  readingTime?: number;
  rating?: number;
  seo: SEOMetadata;
  locale: string;
  translations?: {
    [locale: string]: ObjectId;
  };
  viewCount?: number;
  version?: number;
  previousVersions?: Array<{
    version: number;
    bodyHtml: string;
    savedAt: Date;
    savedBy: ObjectId;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublishJob {
  _id?: ObjectId;
  articleId: ObjectId;
  userId: ObjectId;
  status: JobStatus;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  createdAt: Date;
}

export interface AuditLog {
  _id?: ObjectId;
  userId: ObjectId;
  action: string;
  targetType: 'user' | 'article' | 'media' | 'topic';
  targetId?: ObjectId;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
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
