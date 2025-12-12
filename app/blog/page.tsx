import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleGrid from '@/components/ArticleGrid';
import Sidebar from '@/components/Sidebar';
import { getCollection, Collections } from '@/lib/mongodb';
import { Article, Topic } from '@/types';
import { generateSEOMetadata } from '@/lib/seo';
import { getPopularArticles } from '@/lib/search';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Blog - All Articles',
  description: 'Browse all our expert skincare reviews, guides, and wellness tips.',
  canonical: `${process.env.NEXTAUTH_URL || 'https://blumea.com'}/blog`,
});

export const revalidate = 3600;

async function getBlogData() {
  try {
    const articles = await getCollection<Article>(Collections.ARTICLES);
    const topics = await getCollection<Topic>(Collections.TOPICS);

    const allArticles = await articles
      .find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(30)
      .toArray();

    const popularPosts = await getPopularArticles(3);

    const topicsData = await topics.find().toArray();
    const categoriesWithCounts = await Promise.all(
      topicsData.map(async (topic) => {
        const count = await articles.countDocuments({
          status: 'published',
          topics: topic.slug,
        });
        return {
          slug: topic.slug,
          title: topic.title,
          count,
        };
      })
    );

    return {
      articles: allArticles,
      popularPosts,
      categories: categoriesWithCounts.filter((c) => c.count > 0),
    };
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return {
      articles: [],
      popularPosts: [],
      categories: [],
    };
  }
}

export default async function BlogPage() {
  const { articles, popularPosts, categories } = await getBlogData();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-12">
        <h1 className="text-4xl font-bold mb-8">All Articles</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ArticleGrid articles={articles} />
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
