export default function ArticlePageSkeleton() {
  return (
    <div className="container py-12 max-w-4xl animate-pulse">
      <div className="h-6 w-32 bg-muted rounded mb-6"></div>
      <div className="h-12 bg-muted rounded mb-2"></div>
      <div className="h-12 bg-muted rounded w-4/5 mb-6"></div>
      
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-muted"></div>
          <div>
            <div className="h-4 w-24 bg-muted rounded mb-1"></div>
            <div className="h-3 w-32 bg-muted rounded"></div>
          </div>
        </div>
        <div className="h-4 w-24 bg-muted rounded"></div>
        <div className="h-4 w-24 bg-muted rounded"></div>
        <div className="h-4 w-24 bg-muted rounded"></div>
      </div>
      
      <div className="aspect-video bg-muted rounded-lg mb-8"></div>
      
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i}>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
