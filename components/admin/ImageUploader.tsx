'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ImageUploaderProps {
  onUploadComplete: (media: any) => void;
  onError?: (error: string) => void;
}

export function ImageUploader({ onUploadComplete, onError }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [credit, setCredit] = useState('');
  const [showMetadataForm, setShowMetadataForm] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setShowMetadataForm(true);
    };
    reader.readAsDataURL(selectedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleCancel = () => {
    setFile(null);
    setPreview(null);
    setAltText('');
    setCaption('');
    setCredit('');
    setShowMetadataForm(false);
  };

  const handleUpload = async () => {
    if (!file || !altText.trim()) {
      onError?.('Alt text is required');
      return;
    }

    setIsUploading(true);

    try {
      // In a real implementation, you would upload to a CDN or cloud storage
      // For now, we'll convert to base64 as a placeholder
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;

        // Get image dimensions
        const img = new Image();
        img.src = base64;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        // Create media record
        const response = await fetch('/api/admin/media', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: base64, // In production, this would be the uploaded URL
            cdnUrl: base64,
            mimeType: file.type,
            width: img.width,
            height: img.height,
            altText: altText.trim(),
            caption: caption.trim() || undefined,
            credit: credit.trim() || undefined,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }

        const result = await response.json();
        onUploadComplete(result.media);
        handleCancel();
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      onError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  if (showMetadataForm && preview) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="max-w-full max-h-64 rounded-lg mx-auto"
          />
          <button
            onClick={handleCancel}
            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            disabled={isUploading}
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              Alt Text <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image for accessibility"
              required
              disabled={isUploading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Required for accessibility and SEO
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Caption</label>
            <Input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Optional caption for the image"
              disabled={isUploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Credit</label>
            <Input
              type="text"
              value={credit}
              onChange={(e) => setCredit(e.target.value)}
              placeholder="Photo credit or source"
              disabled={isUploading}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={isUploading || !altText.trim()}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Image'
              )}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={isUploading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
        ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
      {isDragActive ? (
        <p className="text-lg font-medium">Drop the image here...</p>
      ) : (
        <>
          <p className="text-lg font-medium mb-2">
            Drag & drop an image here, or click to select
          </p>
          <p className="text-sm text-muted-foreground">
            Supports PNG, JPG, GIF, WebP (max 10MB)
          </p>
        </>
      )}
    </div>
  );
}
