'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { SEOMetadata } from '@/types';

interface SEOPaneProps {
  seo: SEOMetadata;
  onChange: (seo: SEOMetadata) => void;
}

export function SEOPane({ seo, onChange }: SEOPaneProps) {
  const updateField = (field: keyof SEOMetadata, value: any) => {
    onChange({ ...seo, [field]: value });
  };

  return (
    <div className="space-y-6 p-6 bg-card border rounded-lg sticky top-6">
      <h2 className="text-xl font-semibold">SEO Settings</h2>

      <div>
        <label className="block text-sm font-medium mb-2">
          Meta Title
          <span className="text-muted-foreground ml-2">
            ({seo.title.length}/60)
          </span>
        </label>
        <Input
          type="text"
          value={seo.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Enter meta title..."
          maxLength={60}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Target: 50-60 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Meta Description
          <span className="text-muted-foreground ml-2">
            ({seo.description.length}/160)
          </span>
        </label>
        <textarea
          value={seo.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Enter meta description..."
          maxLength={160}
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Target: 150-160 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Canonical URL
        </label>
        <Input
          type="url"
          value={seo.canonicalUrl || ''}
          onChange={(e) => updateField('canonicalUrl', e.target.value)}
          placeholder="https://example.com/article"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Primary Keyword
        </label>
        <Input
          type="text"
          value={seo.primaryKeyword || ''}
          onChange={(e) => updateField('primaryKeyword', e.target.value)}
          placeholder="Enter primary keyword..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          OG Image URL
        </label>
        <Input
          type="url"
          value={seo.ogImage || ''}
          onChange={(e) => updateField('ogImage', e.target.value)}
          placeholder="Image URL for social sharing"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="noindex"
          checked={seo.noindex || false}
          onChange={(e) => updateField('noindex', e.target.checked)}
          className="rounded"
        />
        <label htmlFor="noindex" className="text-sm font-medium">
          Noindex (hide from search engines)
        </label>
      </div>
    </div>
  );
}
