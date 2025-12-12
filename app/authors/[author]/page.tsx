import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleGrid from '@/components/ArticleGrid';
import { getCollection, Collections } from '@/lib/mongodb';
import { Article, Author } from '@/types';
import { generateSEOMetadata } from '@/lib/seo';

interface AuthorPageProps {
  params: { author: string };
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const authors = await getCollection<Author>(Collections.AUTHORS);
  const author = await authors.findOne({ _id: { $eq: params.author } as any });

  if (!author) {
    return { title: 'Author Not Found' };
  }

  return generateSEOMetadata({
    title: `${author.name} - Skincare Expert`,
    description: author.bio,
    canonical: `${process.env.NEXTAUTH_URL}/authors/${params.author}`,
  });
}

async function getAuthorData(authorId: string) {
  try {
    const authors = await getCollection<Author>(Collections.AUTHORS);
    const articles = await getCollection<Article>(Collections.ARTICLES);

    const author = await authors.findOne({ _id: { $eq: authorId } as any });

    if (!author) {
      return null;
    }

    const authorArticles = await articles
      .find({ authorId: author._id, status: 'published' })
      .sort({ publishedAt: -1 })
      .toArray();

    return { author, articles: authorArticles };
  } catch (error) {
    console.error('Error fetching author data:', error);
    return null;
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const data = await getAuthorData(params.author);

  if (!data) {
    notFound();
  }

  const { author, articles } = data;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="container py-12">
          <div className="max-w-4xl mx-auto">
            {/* Author Header */}
            <div className="bg-card border border-border rounded-lg p-8 mb-12">
              <div className="flex items-start gap-6">
                <div className="w-32 h-32 rounded-full bg-muted flex-shrink-0"></div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-3">{author.name}</h1>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {author.credentials.map((cred, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-muted rounded-full text-sm"
                      >
                        {cred}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{author.bio}</p>
                  
                  {author.social && (
                    <div className="flex gap-4 text-sm">
                      {author.social.twitter && (
                        <a
                          href={author.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          Twitter
                        </a>
                      )}
                      {author.social.instagram && (
                        <a
                          href={author.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          Instagram
                        </a>
                      )}
                      {author.social.website && (
                        <a
                          href={author.social.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          Website
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Articles by Author */}
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Articles by {author.name} ({articles.length})
              </h2>
              <ArticleGrid articles={articles} />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
