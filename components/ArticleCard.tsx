import Link from 'next/link';
import { Card } from './ui/card';
import CategoryPill from './CategoryPill';
import StarRating from './StarRating';
import { Clock, Calendar } from 'lucide-react';
import { Article } from '@/types';

interface ArticleCardProps {
  article: Article;
  showImage?: boolean;
}

export default function ArticleCard({ article, showImage = true }: ArticleCardProps) {
  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Draft';

  return (
    <Link href={`/blog/${article.slug}`}>
      <Card className="overflow-hidden h-full hover:bg-card/80 transition-colors cursor-pointer">
        {showImage && article.featuredImageId && (
          <div className="aspect-video bg-muted"></div>
        )}
        
        <div className="p-6">
          <div className="mb-3">
            <CategoryPill category={article.topics[0] || 'Article'} />
          </div>
          
          <h3 className="text-xl font-semibold mb-2 line-clamp-2 hover:accent-text transition-colors">
            {article.title}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {article.summary}
          </p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
              
              {article.readingTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{article.readingTime} min read</span>
                </div>
              )}
            </div>
            
            {article.rating && <StarRating rating={article.rating} />}
          </div>
        </div>
      </Card>
    </Link>
  );
}
