import { describe, it, expect } from 'vitest';
import { sanitizeHTML, sanitizePlainText, sanitizeUrl, sanitizeUserContent } from '../../lib/sanitize';

describe('sanitizeHTML', () => {
  it('should remove script tags', () => {
    const dirty = '<p>Hello</p><script>alert("xss")</script>';
    const clean = sanitizeHTML(dirty);
    expect(clean).not.toContain('<script');
    expect(clean).toContain('<p>Hello</p>');
  });

  it('should remove javascript: URLs', () => {
    const dirty = '<a href="javascript:alert(\'xss\')">Click</a>';
    const clean = sanitizeHTML(dirty);
    expect(clean).not.toContain('javascript:');
  });

  it('should allow safe HTML tags', () => {
    const dirty = '<h1>Title</h1><p>Paragraph with <strong>bold</strong> text</p>';
    const clean = sanitizeHTML(dirty);
    expect(clean).toContain('<h1>Title</h1>');
    expect(clean).toContain('<strong>bold</strong>');
  });

  it('should remove onclick handlers', () => {
    const dirty = '<div onclick="alert(\'xss\')">Content</div>';
    const clean = sanitizeHTML(dirty);
    expect(clean).not.toContain('onclick');
  });
});

describe('sanitizePlainText', () => {
  it('should strip all HTML tags', () => {
    const dirty = '<p>Hello <strong>world</strong></p>';
    const clean = sanitizePlainText(dirty);
    expect(clean).toBe('Hello world');
  });

  it('should handle script tags', () => {
    const dirty = 'Text<script>alert("xss")</script>';
    const clean = sanitizePlainText(dirty);
    expect(clean).toBe('Text');
  });
});

describe('sanitizeUrl', () => {
  it('should allow https URLs', () => {
    const url = 'https://example.com';
    expect(sanitizeUrl(url)).toBe(url);
  });

  it('should block javascript: URLs', () => {
    const url = 'javascript:alert("xss")';
    expect(sanitizeUrl(url)).toBe('');
  });

  it('should block data: URLs', () => {
    const url = 'data:text/html,<script>alert("xss")</script>';
    expect(sanitizeUrl(url)).toBe('');
  });

  it('should allow relative URLs', () => {
    const url = '/blog/article';
    expect(sanitizeUrl(url)).toBe(url);
  });
});

describe('sanitizeUserContent', () => {
  it('should only allow basic formatting', () => {
    const dirty = '<p>Text with <strong>bold</strong> and <a href="#">link</a></p>';
    const clean = sanitizeUserContent(dirty);
    expect(clean).toContain('<strong>bold</strong>');
    expect(clean).not.toContain('<a');
  });
});
