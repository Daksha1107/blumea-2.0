import { MetadataRoute } from 'next';
import { getCollection, Collections } from '@/lib/mongodb';
import { Article, Topic } from '@/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://blumea.com';

  try {
    const articles = await getCollection<Article>(Collections.ARTICLES);
    const topics = await getCollection<Topic>(Collections.TOPICS);

    // Get all published articles
    const publishedArticles = await articles
      .find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .toArray();

    // Get all topics
    const allTopics = await topics.find().toArray();

    // Homepage
    const routes: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
        alternates: {
          languages: {
            en: `${baseUrl}`,
            es: `${baseUrl}/es`,
          },
        },
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ];

    // Article pages
    publishedArticles.forEach((article) => {
      routes.push({
        url: `${baseUrl}/blog/${article.slug}`,
        lastModified: article.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: article.translations
          ? {
              languages: Object.entries(article.translations).reduce(
                (acc, [locale, id]) => {
                  acc[locale] = `${baseUrl}/${locale}/blog/${article.slug}`;
                  return acc;
                },
                { [article.locale]: `${baseUrl}/blog/${article.slug}` } as Record<string, string>
              ),
            }
          : undefined,
      });
    });

    // Topic pages
    allTopics.forEach((topic) => {
      routes.push({
        url: `${baseUrl}/topics/${topic.slug}`,
        lastModified: topic.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });

    return routes;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return minimal sitemap on error
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];
  }
}
