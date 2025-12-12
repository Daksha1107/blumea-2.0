export default function SidebarSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Search */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="h-10 bg-muted rounded"></div>
      </div>

      {/* Popular Posts */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="h-6 w-32 bg-muted rounded mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-16 h-16 bg-muted rounded flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="h-6 w-32 bg-muted rounded mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 bg-muted rounded"></div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="h-6 w-40 bg-muted rounded mb-2"></div>
        <div className="h-4 bg-muted rounded mb-4"></div>
        <div className="h-10 bg-muted rounded mb-2"></div>
        <div className="h-10 bg-muted rounded"></div>
      </div>
    </div>
  );
}
