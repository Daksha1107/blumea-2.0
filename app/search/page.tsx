'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleGrid from '@/components/ArticleGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';
import { Article } from '@/types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.articles || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(query)}`);
      performSearch(query);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-12">
        <h1 className="text-4xl font-bold mb-8">Search</h1>
        
        <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-2xl">
          <Input
            type="text"
            placeholder="Search articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            <SearchIcon className="w-4 h-4 mr-2" />
            Search
          </Button>
        </form>

        {loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Searching...</p>
          </div>
        )}

        {!loading && searched && (
          <>
            <p className="text-muted-foreground mb-6">
              {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{searchParams.get('q')}&quot;
            </p>
            {results.length > 0 ? (
              <ArticleGrid articles={results} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No articles found. Try different keywords.
                </p>
              </div>
            )}
          </>
        )}

        {!searched && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Enter a search query to find articles.
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
