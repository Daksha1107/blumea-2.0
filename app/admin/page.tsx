import { getCollection, Collections } from '@/lib/mongodb';
import { Article } from '@/types';

export default async function AdminDashboard() {
  let stats = {
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalViews: 0,
  };

  try {
    const articles = await getCollection<Article>(Collections.ARTICLES);

    const [total, published, drafts, viewsResult] = await Promise.all([
      articles.countDocuments(),
      articles.countDocuments({ status: 'published' }),
      articles.countDocuments({ status: 'draft' }),
      articles.aggregate([
        { $group: { _id: null, total: { $sum: '$viewCount' } } }
      ]).toArray(),
    ]);

    stats = {
      totalArticles: total,
      publishedArticles: published,
      draftArticles: drafts,
      totalViews: viewsResult[0]?.total || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Articles</h3>
          <p className="text-3xl font-bold">{stats.totalArticles}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Published</h3>
          <p className="text-3xl font-bold accent-text">{stats.publishedArticles}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Drafts</h3>
          <p className="text-3xl font-bold">{stats.draftArticles}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Views</h3>
          <p className="text-3xl font-bold">{stats.totalViews.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <a
            href="/admin/queue"
            className="block px-4 py-2 bg-background hover:bg-muted rounded transition-colors"
          >
            View Publish Queue
          </a>
          <a
            href="/blog"
            className="block px-4 py-2 bg-background hover:bg-muted rounded transition-colors"
          >
            View Public Site
          </a>
        </div>
      </div>
    </div>
  );
}
