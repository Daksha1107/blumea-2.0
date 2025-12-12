import sanitizeHtml from 'sanitize-html';

const defaultOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'strong', 'em', 'u', 's', 'mark',
    'blockquote', 'pre', 'code',
    'ul', 'ol', 'li',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'div', 'span',
  ],
  allowedAttributes: {
    'a': ['href', 'title', 'target', 'rel'],
    'img': ['src', 'alt', 'title', 'width', 'height', 'loading'],
    'div': ['class', 'id'],
    'span': ['class', 'id'],
    'code': ['class'],
    'pre': ['class'],
    '*': ['style'],
  },
  allowedStyles: {
    '*': {
      'color': [/^#[0-9a-fA-F]{3,6}$/],
      'background-color': [/^#[0-9a-fA-F]{3,6}$/],
      'text-align': [/^(left|right|center|justify)$/],
      'font-weight': [/^\d+$/],
      'font-size': [/^\d+px$/],
    },
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: {
    img: ['http', 'https', 'data'],
  },
  allowProtocolRelative: false,
  disallowedTagsMode: 'discard',
  enforceHtmlBoundary: true,
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Removes all script tags and dangerous attributes
 */
export function sanitizeHTML(dirty: string, options?: sanitizeHtml.IOptions): string {
  const mergedOptions = options ? { ...defaultOptions, ...options } : defaultOptions;
  return sanitizeHtml(dirty, mergedOptions);
}

/**
 * Strict sanitization for user-generated content
 * Only allows basic formatting tags
 */
export function sanitizeUserContent(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: ['p', 'br', 'strong', 'em', 'u'],
    allowedAttributes: {},
    disallowedTagsMode: 'discard',
  });
}

/**
 * Sanitizes plain text (strips all HTML)
 */
export function sanitizePlainText(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

/**
 * Sanitizes URLs to prevent javascript: and data: attacks
 */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  
  // Check for dangerous protocols
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return '';
  }

  // Allow relative URLs, http, https, and mailto
  if (/^(https?:|mailto:|\/)/i.test(trimmed) || !/:/.test(trimmed)) {
    return trimmed;
  }

  return '';
}

/**
 * Validates and sanitizes article content before saving
 */
export function sanitizeArticle(article: {
  title: string;
  summary: string;
  bodyHtml: string;
}): {
  title: string;
  summary: string;
  bodyHtml: string;
} {
  return {
    title: sanitizePlainText(article.title),
    summary: sanitizePlainText(article.summary),
    bodyHtml: sanitizeHTML(article.bodyHtml),
  };
}
