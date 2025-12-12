import Search from './Search';
import PopularPosts from './PopularPosts';
import Categories from './Categories';
import Newsletter from './Newsletter';
import { Article, CategoryWithCount } from '@/types';

interface SidebarProps {
  popularPosts: Article[];
  categories: CategoryWithCount[];
}

export default function Sidebar({ popularPosts, categories }: SidebarProps) {
  return (
    <aside className="space-y-8">
      <Search />
      <PopularPosts posts={popularPosts} />
      <Categories categories={categories} />
      <Newsletter />
    </aside>
  );
}
