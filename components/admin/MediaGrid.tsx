'use client';

import React, { useState } from 'react';
import { Trash2, Edit, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Media } from '@/types';

interface MediaGridProps {
  media: (Media & { _id: { toString: () => string } })[];
  onSelect?: (media: Media & { _id: { toString: () => string } }) => void;
  onDelete?: (id: string) => void;
  selectedId?: string;
}

export function MediaGrid({ media, onSelect, onDelete, selectedId }: MediaGridProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(null);
    }
  };

  if (media.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No images uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {media.map((item) => {
        const id = item._id.toString();
        const isSelected = selectedId === id;
        const isDeleting = deletingId === id;
        const showConfirm = showDeleteConfirm === id;

        return (
          <div
            key={id}
            className={`
              group relative rounded-lg overflow-hidden border-2 transition-all
              ${isSelected ? 'border-primary ring-2 ring-primary' : 'border-transparent hover:border-muted'}
              ${onSelect ? 'cursor-pointer' : ''}
            `}
            onClick={() => onSelect?.(item)}
          >
            {/* Image */}
            <div className="aspect-square bg-muted relative">
              <img
                src={item.cdnUrl || item.url}
                alt={item.altText}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {isSelected && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="p-3 bg-card">
              <p className="text-sm font-medium truncate" title={item.altText}>
                {item.altText}
              </p>
              {item.width && item.height && (
                <p className="text-xs text-muted-foreground mt-1">
                  {item.width} × {item.height}
                </p>
              )}
            </div>

            {/* Hover Actions */}
            {!showConfirm && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {onDelete && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(id);
                    }}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Delete Confirmation */}
            {showConfirm && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 gap-2">
                <p className="text-white text-sm text-center font-medium">
                  Delete this image?
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(id);
                    }}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(null);
                    }}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
