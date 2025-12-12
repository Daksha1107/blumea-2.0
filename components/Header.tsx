import Link from 'next/link';
import { Search } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold accent-text">
            SKINCARE & WELLNESS
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/blog" className="text-foreground hover:accent-text transition-colors">
              Blog
            </Link>
            <Link href="/topics/serums" className="text-foreground hover:accent-text transition-colors">
              Serums
            </Link>
            <Link href="/topics/moisturizers" className="text-foreground hover:accent-text transition-colors">
              Moisturizers
            </Link>
            <Link href="/topics/cleansers" className="text-foreground hover:accent-text transition-colors">
              Cleansers
            </Link>
            <Link href="/search" className="text-foreground hover:accent-text transition-colors">
              <Search className="w-5 h-5" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
