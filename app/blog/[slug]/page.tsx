import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCollection, Collections } from '@/lib/mongodb';
import { Article, Author } from '@/types';
import { generateSEOMetadata, generateArticleJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import { incrementViewCount } from '@/lib/search';
import { Clock, Calendar } from 'lucide-react';
import StarRating from '@/components/StarRating';
import CategoryPill from '@/components/CategoryPill';

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const articles = await getCollection<Article>(Collections.ARTICLES);
  const article = await articles.findOne({ slug: params.slug, status: 'published' });

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const baseUrl = process.env.NEXTAUTH_URL || 'https://blumea.com';

  return generateSEOMetadata({
    title: article.seo.title || article.title,
    description: article.seo.description || article.summary,
    canonical: `${baseUrl}/blog/${article.slug}`,
    ogType: 'article',
    publishedTime: article.publishedAt?.toISOString(),
    modifiedTime: article.updatedAt.toISOString(),
    tags: article.topics,
    locale: article.locale,
  });
}

async function getArticleData(slug: string) {
  try {
    const articles = await getCollection<Article>(Collections.ARTICLES);
    const authors = await getCollection<Author>(Collections.AUTHORS);

    const article = await articles.findOne({ slug, status: 'published' });

    if (!article) {
      return null;
    }

    const author = await authors.findOne({ _id: article.authorId });

    // Increment view count
    await incrementViewCount(article._id!);

    return { article, author };
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const data = await getArticleData(params.slug);

  if (!data) {
    notFound();
  }

  const { article, author } = data;
  const baseUrl = process.env.NEXTAUTH_URL || 'https://blumea.com';
  const articleUrl = `${baseUrl}/blog/${article.slug}`;

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const articleJsonLd = author
    ? generateArticleJsonLd(article, author, articleUrl)
    : null;

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: baseUrl },
    { name: 'Blog', url: `${baseUrl}/blog` },
    { name: article.title, url: articleUrl },
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <article className="container py-12 max-w-4xl">
          <div className="mb-6">
            <CategoryPill category={article.topics[0] || 'Article'} />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">{article.title}</h1>

          <div className="flex flex-wrap items-center gap-4 mb-8 text-muted-foreground">
            {author && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-muted"></div>
                <div>
                  <p className="text-sm font-medium text-foreground">{author.name}</p>
                  <p className="text-xs">{author.credentials[0]}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{formattedDate}</span>
            </div>

            {article.readingTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{article.readingTime} min read</span>
              </div>
            )}

            {article.rating && <StarRating rating={article.rating} />}
          </div>

          {article.featuredImageId && (
            <div className="aspect-video bg-muted rounded-lg mb-8"></div>
          )}

          <div className="prose prose-invert prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: article.bodyHtml }} />
          </div>

          {author && (
            <div className="mt-12 p-6 bg-card border border-border rounded-lg">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-muted flex-shrink-0"></div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{author.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{author.bio}</p>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    {author.credentials.map((cred, i) => (
                      <span key={i} className="px-2 py-1 bg-muted rounded">
                        {cred}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </article>

        {/* JSON-LD structured data */}
        {articleJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      </main>
      
      <Footer />
    </div>
  );
}
