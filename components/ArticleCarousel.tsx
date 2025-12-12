'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Article } from '@/types';
import CategoryPill from './CategoryPill';
import { Clock } from 'lucide-react';

interface ArticleCarouselProps {
  newArticles: Article[];
  popularArticles: Article[];
}

export default function ArticleCarousel({ newArticles, popularArticles }: ArticleCarouselProps) {
  const [activeTab, setActiveTab] = useState<'new' | 'popular'>('new');
  
  const articles = activeTab === 'new' ? newArticles : popularArticles;

  return (
    <div className="mb-12">
      {/* Tabs */}
      <div className="flex gap-8 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab('new')}
          className={`pb-3 px-2 text-lg font-semibold transition-colors relative ${
            activeTab === 'new' ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          NEW
          {activeTab === 'new' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('popular')}
          className={`pb-3 px-2 text-lg font-semibold transition-colors relative ${
            activeTab === 'popular' ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          POPULAR
          {activeTab === 'popular' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
          )}
        </button>
      </div>

      {/* Horizontal scroll container */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-6 pb-4" style={{ scrollSnapType: 'x mandatory' }}>
          {articles.map((article) => (
            <Link
              key={article._id?.toString()}
              href={`/blog/${article.slug}`}
              className="flex-shrink-0 w-80 group"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-accent/50 transition-all">
                {/* Thumbnail */}
                <div className="aspect-video bg-muted group-hover:opacity-90 transition-opacity" />
                
                {/* Content */}
                <div className="p-4">
                  <CategoryPill category={article.topics[0] || 'Article'} size="sm" />
                  
                  <h3 className="text-lg font-semibold mt-3 mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                    {article.title}
                  </h3>
                  
                  {article.readingTime && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{article.readingTime} min read</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
