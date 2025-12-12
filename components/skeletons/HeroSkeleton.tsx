export default function HeroSkeleton() {
  return (
    <section className="container py-12 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="h-6 w-48 bg-muted rounded mb-4"></div>
          <div className="h-12 bg-muted rounded mb-2"></div>
          <div className="h-12 bg-muted rounded w-4/5 mb-4"></div>
          <div className="h-6 bg-muted rounded w-full mb-2"></div>
          <div className="h-6 bg-muted rounded w-3/4 mb-6"></div>
          <div className="flex gap-4">
            <div className="h-12 w-40 bg-muted rounded"></div>
            <div className="h-12 w-40 bg-muted rounded"></div>
          </div>
        </div>
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="aspect-video bg-muted mb-4 rounded-md"></div>
          <div className="h-6 bg-muted rounded mb-2"></div>
          <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-full mb-2"></div>
          <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
          <div className="h-10 bg-muted rounded"></div>
        </div>
      </div>
    </section>
  );
}
