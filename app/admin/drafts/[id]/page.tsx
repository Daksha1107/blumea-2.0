'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Editor } from '@/components/admin/Editor';
import { SEOPane } from '@/components/admin/SEOPane';
import { SEOScoreWidget } from '@/components/admin/SEOScoreWidget';
import { Button } from '@/components/ui/button';
import { Save, Eye, Upload, Clock } from 'lucide-react';
import { Article, SEOMetadata } from '@/types';

export default function DraftEditorPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;

  const [article, setArticle] = useState<Partial<Article> | null>(null);
  const [bodyHtml, setBodyHtml] = useState('');
  const [seo, setSeo] = useState<SEOMetadata>({
    title: '',
    description: '',
    keywords: [],
    canonicalUrl: '',
    primaryKeyword: '',
    ogImage: '',
    noindex: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch article
  useEffect(() => {
    fetchArticle();
  }, [articleId]);

  // Auto-save every 10 seconds
  useEffect(() => {
    if (!autoSaveEnabled || !article) return;

    const interval = setInterval(() => {
      handleSave();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [bodyHtml, seo, autoSaveEnabled, article]);

  // Keyboard shortcut: Cmd+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [bodyHtml, seo]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/articles/${articleId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch article');
      }

      const data = await response.json();
      setArticle(data.article);
      setBodyHtml(data.article.bodyHtml || '');
      setSeo(data.article.seo || seo);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch article');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!article || saving) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bodyHtml,
          seo,
          version: (article.version || 0) + 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save article');
      }

      setLastSaved(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error && !article) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => router.push('/admin')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Error banner */}
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 text-center">
          {error}
        </div>
      )}

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{article?.title || 'Untitled'}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Version {article?.version || 1}</span>
            {lastSaved && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor - 70% */}
          <div className="lg:col-span-2 space-y-6">
            <Editor
              content={bodyHtml}
              onChange={setBodyHtml}
              placeholder="Start writing your article..."
            />

            <SEOScoreWidget seo={seo} bodyHtml={bodyHtml} />
          </div>

          {/* SEO Pane - 30% */}
          <div className="lg:col-span-1">
            <SEOPane seo={seo} onChange={setSeo} />
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4">
          <div className="container mx-auto max-w-7xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                variant="outline"
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Now'}
              </Button>
              <span className="text-xs text-muted-foreground">
                {autoSaveEnabled ? '(Auto-save enabled)' : '(Auto-save disabled)'}
              </span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
