'use client';

import React, { useState, useEffect } from 'react';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { MediaGrid } from '@/components/admin/MediaGrid';
import { Button } from '@/components/ui/button';
import { Upload, Grid3x3, List } from 'lucide-react';
import { Media } from '@/types';

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<(Media & { _id: { toString: () => string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMedia();
  }, [page]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/media?page=${page}&limit=24`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch media');
      }

      const data = await response.json();
      setMedia(data.media);
      setTotalPages(data.pagination.totalPages);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch media');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (newMedia: any) => {
    setMedia((prev) => [newMedia, ...prev]);
    setShowUploader(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete media');
      }

      // Remove from local state
      setMedia((prev) => prev.filter((item) => item._id.toString() !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete media');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Media Library</h1>
          <p className="text-muted-foreground">
            Upload and manage images for your articles
          </p>
        </div>
        <Button
          onClick={() => setShowUploader(!showUploader)}
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          {showUploader ? 'Hide Uploader' : 'Upload Image'}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Uploader */}
      {showUploader && (
        <div className="mb-8 p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Upload New Image</h2>
          <ImageUploader
            onUploadComplete={handleUploadComplete}
            onError={(err) => setError(err)}
          />
        </div>
      )}

      {/* Media Grid */}
      <div className="space-y-6">
        {loading && page === 1 ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading media...</p>
          </div>
        ) : (
          <>
            <MediaGrid
              media={media}
              onDelete={handleDelete}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  variant="outline"
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground px-4">
                  Page {page} of {totalPages}
                </span>
                <Button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || loading}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
