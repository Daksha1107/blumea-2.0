'use client';

import { useState } from 'react';
import { Facebook, Twitter, Linkedin, Link2, Check } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-2">Share:</span>
      
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter"
        className="p-2 rounded-lg bg-card border border-border hover:border-accent hover:text-accent transition-colors"
      >
        <Twitter className="w-4 h-4" />
      </a>
      
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="p-2 rounded-lg bg-card border border-border hover:border-accent hover:text-accent transition-colors"
      >
        <Facebook className="w-4 h-4" />
      </a>
      
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="p-2 rounded-lg bg-card border border-border hover:border-accent hover:text-accent transition-colors"
      >
        <Linkedin className="w-4 h-4" />
      </a>
      
      <button
        onClick={handleCopyLink}
        aria-label="Copy link"
        className="p-2 rounded-lg bg-card border border-border hover:border-accent hover:text-accent transition-colors"
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
