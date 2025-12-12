import { describe, it, expect } from 'vitest';
import { calculateReadingTime } from '../../lib/seo';

describe('SEO utilities', () => {
  describe('calculateReadingTime', () => {
    it('should calculate reading time correctly', () => {
      const html = '<p>' + 'word '.repeat(200) + '</p>';
      const time = calculateReadingTime(html);
      expect(time).toBe(1); // 200 words at 200 wpm = 1 minute
    });

    it('should round up to nearest minute', () => {
      const html = '<p>' + 'word '.repeat(250) + '</p>';
      const time = calculateReadingTime(html);
      expect(time).toBe(2); // 250 words at 200 wpm = 1.25 minutes, rounded up to 2
    });

    it('should ignore HTML tags in word count', () => {
      const html = '<div><p><strong>word</strong></p></div>'.repeat(200);
      const time = calculateReadingTime(html);
      expect(time).toBe(1); // Only 200 actual words
    });

    it('should handle empty content', () => {
      const time = calculateReadingTime('');
      expect(time).toBe(0);
    });
  });
});
