import { Card } from '../ui/card';

export default function ArticleCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full animate-pulse">
      <div className="aspect-video bg-muted"></div>
      <div className="p-6">
        <div className="h-6 w-20 bg-muted rounded mb-3"></div>
        <div className="h-6 bg-muted rounded mb-2"></div>
        <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-muted rounded mb-2"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
        <div className="flex items-center justify-between mt-4">
          <div className="h-4 w-24 bg-muted rounded"></div>
          <div className="h-4 w-16 bg-muted rounded"></div>
        </div>
      </div>
    </Card>
  );
}
