import Link from 'next/link';
import { CategoryWithCount } from '@/types';

interface CategoriesProps {
  categories: CategoryWithCount[];
}

export default function Categories({ categories }: CategoriesProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Categories</h3>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={`/topics/${category.slug}`}
              className="flex justify-between items-center py-2 hover:accent-text transition-colors"
            >
              <span>{category.title}</span>
              <span className="text-muted-foreground text-sm">
                ({category.count})
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
