import ArticleCard from './ArticleCard';
import { Article } from '@/types';

interface ArticleGridProps {
  articles: Article[];
}

export default function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article._id?.toString()} article={article} />
      ))}
    </div>
  );
}
