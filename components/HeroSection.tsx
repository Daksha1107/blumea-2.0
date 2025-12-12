import Link from 'next/link';
import { Button } from './ui/button';
import { Article } from '@/types';

interface HeroSectionProps {
  featuredArticle: Article;
  secondaryArticle?: Article;
}

export default function HeroSection({ featuredArticle, secondaryArticle }: HeroSectionProps) {
  return (
    <section className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <span className="text-xs font-semibold accent-text tracking-wider">
              SKINCARE & WELLNESS
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {featuredArticle.title}
          </h1>
          
          <p className="text-lg text-muted-foreground mb-6">
            {featuredArticle.summary}
          </p>
          
          <div className="flex gap-4">
            <Link href={`/blog/${featuredArticle.slug}`}>
              <Button size="lg" className="accent-bg hover:bg-[#b89952]">
                Read Review
              </Button>
            </Link>
            <Link href="/blog">
              <Button size="lg" variant="outline">
                Browse All Stories
              </Button>
            </Link>
          </div>
        </div>
        
        {secondaryArticle && (
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="aspect-video bg-muted mb-4 rounded-md"></div>
            <h3 className="text-xl font-semibold mb-2">
              {secondaryArticle.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {secondaryArticle.summary}
            </p>
            <Link href={`/blog/${secondaryArticle.slug}`}>
              <Button variant="ghost" className="accent-text hover:accent-text/80 px-0">
                Read More →
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
