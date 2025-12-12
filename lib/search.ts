import { getCollection, Collections } from './mongodb';
import { Article, ArticleWithAuthor, Author } from '@/types';
import { ObjectId } from 'mongodb';

export interface SearchOptions {
  query: string;
  topics?: string[];
  locale?: string;
  limit?: number;
  skip?: number;
}

export interface SearchResult {
  articles: ArticleWithAuthor[];
  total: number;
  hasMore: boolean;
}

export async function searchArticles(options: SearchOptions): Promise<SearchResult> {
  const { query, topics, locale = 'en', limit = 20, skip = 0 } = options;

  const articles = await getCollection<Article>(Collections.ARTICLES);
  const authors = await getCollection<Author>(Collections.AUTHORS);

  // Build search filter
  const filter: any = {
    status: 'published',
    locale,
  };

  // Text search if query provided
  if (query) {
    filter.$text = { $search: query };
  }

  // Filter by topics if provided
  if (topics && topics.length > 0) {
    filter.topics = { $in: topics };
  }

  // Execute search with projection for text score
  const projection = query ? { score: { $meta: 'textScore' } } : {};
  const sort: any = query ? { score: { $meta: 'textScore' } } : { publishedAt: -1 };

  const [results, total] = await Promise.all([
    articles
      .find(filter, { projection })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray(),
    articles.countDocuments(filter),
  ]);

  // Fetch authors
  const authorIds = [...new Set(results.map((a) => a.authorId))];
  const authorsMap = new Map<string, Author>();

  if (authorIds.length > 0) {
    const authorsList = await authors
      .find({ _id: { $in: authorIds } })
      .toArray();

    authorsList.forEach((author) => {
      authorsMap.set(author._id!.toString(), author);
    });
  }

  // Combine articles with authors
  const articlesWithAuthors: ArticleWithAuthor[] = results.map((article) => {
    const author = authorsMap.get(article.authorId.toString());
    const { authorId, ...rest } = article;
    return {
      ...rest,
      author: author || {
        _id: article.authorId,
        name: 'Unknown Author',
        bio: '',
        credentials: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
  });

  return {
    articles: articlesWithAuthors,
    total,
    hasMore: skip + limit < total,
  };
}

export async function getPopularArticles(limit: number = 5): Promise<Article[]> {
  const articles = await getCollection<Article>(Collections.ARTICLES);

  return articles
    .find({ status: 'published' })
    .sort({ viewCount: -1, publishedAt: -1 })
    .limit(limit)
    .toArray();
}

export async function getLatestArticles(limit: number = 10): Promise<Article[]> {
  const articles = await getCollection<Article>(Collections.ARTICLES);

  return articles
    .find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .toArray();
}

export async function incrementViewCount(articleId: ObjectId): Promise<void> {
  const articles = await getCollection<Article>(Collections.ARTICLES);

  await articles.updateOne(
    { _id: articleId },
    { $inc: { viewCount: 1 } }
  );
}
