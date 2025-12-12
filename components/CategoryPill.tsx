interface CategoryPillProps {
  category: string;
  size?: 'sm' | 'md';
}

export default function CategoryPill({ category, size = 'md' }: CategoryPillProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span className={`inline-block font-medium rounded-full accent-text bg-transparent border border-accent/30 ${sizeClasses[size]}`}>
      {category.toUpperCase()}
    </span>
  );
}
