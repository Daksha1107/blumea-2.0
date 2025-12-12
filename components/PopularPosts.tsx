import Link from 'next/link';
import { Article } from '@/types';

interface PopularPostsProps {
  posts: Article[];
}

export default function PopularPosts({ posts }: PopularPostsProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Popular Posts</h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post._id?.toString()}
            href={`/blog/${post.slug}`}
            className="flex gap-3 group"
          >
            <div className="w-20 h-20 bg-muted rounded flex-shrink-0"></div>
            <div className="flex-1">
              <h4 className="text-sm font-medium line-clamp-2 group-hover:accent-text transition-colors">
                {post.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {post.viewCount?.toLocaleString() || 0} views
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
