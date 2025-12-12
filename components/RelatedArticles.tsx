import ArticleCard from './ArticleCard';
import { Article } from '@/types';

interface RelatedArticlesProps {
  articles: Article[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard 
            key={article._id?.toString()} 
            article={article} 
            showImage={false}
          />
        ))}
      </div>
    </section>
  );
}
