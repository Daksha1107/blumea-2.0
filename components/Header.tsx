'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [topicsOpen, setTopicsOpen] = useState(false);

  const topics = [
    { name: 'Serums', slug: 'serums' },
    { name: 'Moisturizers', slug: 'moisturizers' },
    { name: 'Cleansers', slug: 'cleansers' },
    { name: 'Sunscreens', slug: 'sunscreens' },
    { name: 'Anti-Aging', slug: 'anti-aging' },
  ];

  return (
    <header className="border-b border-border bg-[--panel] sticky top-0 z-40">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-semibold accent-text tracking-wide">
            SKINCARE & WELLNESS
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/blog" 
              className="text-foreground hover:text-accent transition-colors text-sm font-medium"
            >
              Blog
            </Link>
            
            {/* Topics Dropdown */}
            <div className="relative">
              <button
                onClick={() => setTopicsOpen(!topicsOpen)}
                className="flex items-center gap-1 text-foreground hover:text-accent transition-colors text-sm font-medium"
              >
                Topics
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {topicsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setTopicsOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-20">
                    {topics.map((topic) => (
                      <Link
                        key={topic.slug}
                        href={`/topics/${topic.slug}`}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-accent transition-colors"
                        onClick={() => setTopicsOpen(false)}
                      >
                        {topic.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <Link 
              href="/search" 
              className="text-foreground hover:text-accent transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>
            
            <Link href="/subscribe">
              <Button size="sm" className="bg-accent hover:bg-accent/90 text-background font-medium">
                Subscribe
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/blog"
                className="text-foreground hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              
              <div>
                <p className="text-xs uppercase text-muted-foreground mb-2">Topics</p>
                <div className="flex flex-col space-y-2 pl-4">
                  {topics.map((topic) => (
                    <Link
                      key={topic.slug}
                      href={`/topics/${topic.slug}`}
                      className="text-foreground hover:text-accent transition-colors text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {topic.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <Link
                href="/search"
                className="text-foreground hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Search
              </Link>
              
              <Link href="/subscribe" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="bg-accent hover:bg-accent/90 text-background w-full">
                  Subscribe
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
