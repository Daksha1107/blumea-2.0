interface CategoryPillProps {
  category: string;
}

export default function CategoryPill({ category }: CategoryPillProps) {
  return (
    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full accent-bg text-background">
      {category.toUpperCase()}
    </span>
  );
}
