import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ArticleGrid from '@/components/ArticleGrid';
import ArticleCarousel from '@/components/ArticleCarousel';
import Sidebar from '@/components/Sidebar';
import SkipToContent from '@/components/SkipToContent';
import { getCollection, Collections } from '@/lib/mongodb';
import { Article, Topic } from '@/types';
import { generateSEOMetadata } from '@/lib/seo';
import { getPopularArticles, getLatestArticles } from '@/lib/search';

export const metadata: Metadata = generateSEOMetadata({
  title: 'SKINCARE & WELLNESS - Expert Reviews & Tips',
  description: 'Discover expert skincare reviews, wellness tips, and beauty guides. Your trusted source for science-backed skincare advice.',
  canonical: process.env.NEXTAUTH_URL || 'https://blumea.com',
});

export const revalidate = 3600; // Revalidate every hour

async function getHomePageData() {
  try {
    const articles = await getCollection<Article>(Collections.ARTICLES);
    const topics = await getCollection<Topic>(Collections.TOPICS);

    // Get latest published articles
    const latestArticles = await getLatestArticles(12);
    
    // Get popular articles for sidebar and carousel
    const popularPosts = await getPopularArticles(10);

    // Get categories with counts
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
      featuredArticle: latestArticles[0],
      secondaryArticle: latestArticles[1],
      newArticles: latestArticles.slice(2, 8),
      popularArticles: popularPosts.slice(0, 6),
      recentArticles: latestArticles.slice(8, 12),
      popularPosts: popularPosts.slice(0, 3),
      categories: categoriesWithCounts.filter((c) => c.count > 0),
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return {
      featuredArticle: null,
      secondaryArticle: null,
      newArticles: [],
      popularArticles: [],
      recentArticles: [],
      popularPosts: [],
      categories: [],
    };
  }
}

export default async function HomePage() {
  const { 
    featuredArticle, 
    secondaryArticle, 
    newArticles,
    popularArticles,
    recentArticles, 
    popularPosts, 
    categories 
  } = await getHomePageData();

  if (!featuredArticle) {
    return (
      <div className="min-h-screen flex flex-col">
        <SkipToContent />
        <Header />
        <main id="main-content" className="flex-1 container py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Skincare & Wellness</h1>
            <p className="text-muted-foreground">
              Content is being prepared. Please check back soon!
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SkipToContent />
      <Header />
      
      <main id="main-content" className="flex-1">
        <HeroSection
          featuredArticle={featuredArticle}
          secondaryArticle={secondaryArticle || undefined}
        />

        <section className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {/* Article Carousel */}
              <ArticleCarousel 
                newArticles={newArticles} 
                popularArticles={popularArticles}
              />

              {/* Recent Articles Grid */}
              <div className="mt-12">
                <h2 className="text-3xl font-serif font-bold mb-8">Latest Articles</h2>
                <ArticleGrid articles={recentArticles} />
              </div>
            </div>
            
            <div>
              <Sidebar popularPosts={popularPosts} categories={categories} />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
