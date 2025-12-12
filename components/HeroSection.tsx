import Link from 'next/link';
import { Button } from './ui/button';
import { Article } from '@/types';
import CategoryPill from './CategoryPill';

interface HeroSectionProps {
  featuredArticle: Article;
  secondaryArticle?: Article;
}

export default function HeroSection({ featuredArticle, secondaryArticle }: HeroSectionProps) {
  return (
    <section className="container py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left side - 7 columns */}
        <div className="lg:col-span-7">
          <div className="mb-6">
            <CategoryPill category={featuredArticle.topics[0] || 'FEATURED'} />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight">
            {featuredArticle.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {featuredArticle.summary}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link href={`/blog/${featuredArticle.slug}`}>
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-background font-medium">
                Read Review
              </Button>
            </Link>
            <Link href="/blog">
              <Button size="lg" variant="outline" className="border-border">
                Browse All Stories
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Right side - 5 columns */}
        {secondaryArticle && (
          <div className="lg:col-span-5">
            <Link href={`/blog/${secondaryArticle.slug}`}>
              <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-accent/50 transition-all group h-full">
                {/* Featured image */}
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <CategoryPill category={secondaryArticle.topics[0] || 'Article'} size="sm" />
                  
                  <h3 className="text-2xl font-serif font-semibold mt-4 mb-3 group-hover:text-accent transition-colors">
                    {secondaryArticle.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {secondaryArticle.summary}
                  </p>
                  
                  <span className="text-accent text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read More
                    <span className="text-lg">→</span>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
