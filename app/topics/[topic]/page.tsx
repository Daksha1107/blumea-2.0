import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleGrid from '@/components/ArticleGrid';
import Sidebar from '@/components/Sidebar';
import { getCollection, Collections } from '@/lib/mongodb';
import { Article, Topic as TopicType } from '@/types';
import { generateSEOMetadata } from '@/lib/seo';
import { getPopularArticles } from '@/lib/search';

interface TopicPageProps {
  params: { topic: string };
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const topics = await getCollection<TopicType>(Collections.TOPICS);
  const topic = await topics.findOne({ slug: params.topic });

  if (!topic) {
    return { title: 'Topic Not Found' };
  }

  const baseUrl = process.env.NEXTAUTH_URL || 'https://blumea.com';

  return generateSEOMetadata({
    title: `${topic.title} - Skincare Reviews & Tips`,
    description: topic.description,
    canonical: `${baseUrl}/topics/${topic.slug}`,
  });
}

async function getTopicData(topicSlug: string) {
  try {
    const articles = await getCollection<Article>(Collections.ARTICLES);
    const topics = await getCollection<TopicType>(Collections.TOPICS);

    const topic = await topics.findOne({ slug: topicSlug });

    if (!topic) {
      return null;
    }

    const topicArticles = await articles
      .find({ status: 'published', topics: topicSlug })
      .sort({ publishedAt: -1 })
      .limit(30)
      .toArray();

    const popularPosts = await getPopularArticles(3);

    const allTopics = await topics.find().toArray();
    const categoriesWithCounts = await Promise.all(
      allTopics.map(async (t) => {
        const count = await articles.countDocuments({
          status: 'published',
          topics: t.slug,
        });
        return {
          slug: t.slug,
          title: t.title,
          count,
        };
      })
    );

    return {
      topic,
      articles: topicArticles,
      popularPosts,
      categories: categoriesWithCounts.filter((c) => c.count > 0),
    };
  } catch (error) {
    console.error('Error fetching topic data:', error);
    return null;
  }
}

export default async function TopicPage({ params }: TopicPageProps) {
  const data = await getTopicData(params.topic);

  if (!data) {
    notFound();
  }

  const { topic, articles, popularPosts, categories } = data;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{topic.title}</h1>
          <p className="text-lg text-muted-foreground">{topic.description}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {articles.length > 0 ? (
              <ArticleGrid articles={articles} />
            ) : (
              <p className="text-muted-foreground">No articles found in this category.</p>
            )}
          </div>
          
          <div>
            <Sidebar popularPosts={popularPosts} categories={categories} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
