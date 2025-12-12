# Blumea 2.0 - System Architecture

## Overview

Blumea 2.0 is a production-grade, SEO-first skincare blog built with Next.js 14, featuring a headless CMS, role-based access control, and comprehensive security features.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Fonts**: Playfair Display (headings), Inter (body)
- **UI Components**: Custom components with Radix UI primitives

### Backend
- **API**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Queue System**: BullMQ with Redis (optional)
- **Rate Limiting**: Upstash Redis (optional)

### Infrastructure
- **Hosting**: Vercel (recommended) or any Node.js platform
- **Monitoring**: Sentry
- **Analytics**: Google Analytics 4 (optional)

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  Next.js App Router  │  React Components  │  Tailwind CSS   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      MIDDLEWARE LAYER                        │
├─────────────────────────────────────────────────────────────┤
│  Authentication  │  Authorization  │  Security Headers       │
│  Rate Limiting   │  RBAC Checks   │  CSP                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        API LAYER                             │
├─────────────────────────────────────────────────────────────┤
│  Public APIs        │  Admin APIs        │  Webhooks        │
│  /api/articles      │  /api/admin/*      │  /api/hooks/*    │
│  /api/topics        │  Protected routes   │  Revalidation    │
│  /api/search        │  CRUD operations    │                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC                          │
├─────────────────────────────────────────────────────────────┤
│  /lib/auth.ts       │  /lib/sanitize.ts  │  /lib/seo.ts     │
│  /lib/rbac.ts       │  /lib/search.ts    │  /lib/queue.ts   │
│  /lib/rateLimit.ts  │  /lib/logger.ts    │  /lib/sentry.ts  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                             │
├─────────────────────────────────────────────────────────────┤
│  MongoDB            │  Redis (optional)   │  File Storage    │
│  - articles         │  - rate limits      │  - images        │
│  - authors          │  - job queues       │  - media         │
│  - topics           │  - sessions         │                  │
│  - users            │                     │                  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Public Article Request
1. User requests `/blog/[slug]`
2. Next.js renders page (SSR/ISR)
3. Fetch article from MongoDB
4. Sanitize HTML content
5. Increment view count
6. Fetch related articles
7. Generate SEO metadata & JSON-LD
8. Return rendered page

### Admin Article Creation
1. Editor submits article via admin UI
2. Middleware validates session & role
3. API sanitizes HTML content
4. Article saved to MongoDB as draft
5. Editor publishes article
6. Publish job added to queue
7. Background worker processes job
8. Revalidates affected pages
9. Article appears on public site

### Search Flow
1. User submits search query
2. API performs MongoDB text search
3. Results ranked by relevance score
4. Highlights matching terms
5. Returns paginated results

## Component Hierarchy

```
RootLayout
├── SkipToContent
├── Header
│   ├── Logo
│   ├── Navigation
│   │   ├── Blog Link
│   │   ├── Topics Dropdown
│   │   └── Search Icon
│   └── Subscribe Button
├── Main Content
│   ├── Homepage
│   │   ├── HeroSection
│   │   │   ├── Featured Article
│   │   │   └── Secondary Featured Card
│   │   ├── ArticleCarousel (NEW/POPULAR)
│   │   ├── ArticleGrid
│   │   └── Sidebar
│   │       ├── Search
│   │       ├── PopularPosts
│   │       ├── Categories
│   │       └── Newsletter
│   ├── Article Page
│   │   ├── ReadingProgressBar
│   │   ├── Breadcrumb
│   │   ├── Article Header
│   │   ├── ShareButtons
│   │   ├── Article Body (sanitized HTML)
│   │   ├── AuthorCard
│   │   └── RelatedArticles
│   └── Admin Pages
│       ├── Dashboard
│       ├── Article Editor
│       ├── Media Library
│       └── User Management
├── Footer
│   ├── Links
│   └── Copyright
└── CookieBanner
```

## Security Architecture

### Authentication Flow
1. User submits credentials
2. NextAuth validates against MongoDB users
3. JWT token generated with role claim
4. Session stored in encrypted cookie
5. Middleware validates on each request

### Authorization Model
- **Viewer**: Can view admin dashboard and drafts
- **Editor**: Can create and edit articles
- **SEO**: Can edit + manage SEO settings
- **Admin**: Full access including user management

### Security Measures
- XSS Prevention: HTML sanitization with whitelist
- CSRF Protection: NextAuth built-in
- SQL Injection: N/A (MongoDB with parameterized queries)
- Rate Limiting: IP-based with Upstash Redis
- Security Headers: CSP, X-Frame-Options, etc.
- Input Validation: Zod schemas for env vars
- Content Sanitization: Server-side on save & render

## Database Schema

### Articles Collection
```typescript
{
  _id: ObjectId,
  slug: string (unique, indexed),
  title: string,
  summary: string,
  bodyHtml: string (sanitized),
  authorId: ObjectId,
  topics: string[] (indexed),
  keywords: string[],
  status: 'draft' | 'published' | 'archived',
  publishedAt?: Date (indexed),
  featuredImageId?: ObjectId,
  readingTime?: number,
  rating?: number,
  seo: {
    title: string,
    description: string,
    keywords: string[],
    ogImage?: string,
    canonicalUrl?: string
  },
  locale: string,
  translations?: { [locale: string]: ObjectId },
  viewCount: number (indexed),
  createdAt: Date,
  updatedAt: Date (indexed)
}
```

### Authors Collection
```typescript
{
  _id: ObjectId,
  name: string,
  bio: string,
  avatarId?: ObjectId,
  credentials: string[],
  social?: {
    twitter?: string,
    instagram?: string,
    website?: string
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Topics Collection
```typescript
{
  _id: ObjectId,
  slug: string (unique, indexed),
  title: string,
  description: string,
  parentTopic?: string,
  articleCount?: number,
  createdAt: Date,
  updatedAt: Date
}
```

### Users Collection
```typescript
{
  _id: ObjectId,
  email: string (unique, indexed),
  name: string,
  role: 'viewer' | 'editor' | 'seo' | 'admin',
  passwordHash: string,
  createdAt: Date,
  updatedAt: Date
}
```

## Performance Optimization

### Caching Strategy
- **Static Pages**: Generated at build time (legal pages)
- **ISR Pages**: Revalidated every 3600s (homepage, articles)
- **Dynamic Pages**: Generated on-demand (search, admin)

### Image Optimization
- Next.js Image component with automatic optimization
- WebP format with fallback
- Responsive images with srcset
- Lazy loading below the fold

### Code Splitting
- Automatic code splitting by route
- Dynamic imports for heavy components
- Separate bundles for admin pages

### Database Optimization
- Indexes on frequently queried fields
- Aggregation pipelines for complex queries
- Connection pooling (min: 5, max: 10)

## Monitoring & Observability

### Error Tracking
- Sentry integration for error monitoring
- Source maps uploaded for debugging
- Custom error boundaries

### Logging
- Structured logging with Winston
- Log levels: error, warn, info, debug
- Log rotation and retention

### Metrics
- Page load time
- API response time
- Database query performance
- Cache hit rates

## Deployment Strategy

### Build Process
1. Run type checking: `npm run typecheck`
2. Run linting: `npm run lint`
3. Run tests: `npm test && npm run test:e2e`
4. Build application: `npm run build`
5. Deploy to hosting platform

### Environment Variables
Required:
- `MONGODB_URI`
- `MONGODB_DBNAME`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

Optional:
- `REDIS_URL`
- `SENTRY_DSN`
- `REVALIDATION_SECRET`

### CI/CD Pipeline
1. Push to repository
2. GitHub Actions triggered
3. Install dependencies
4. Run linting and type checking
5. Run unit tests
6. Run E2E tests
7. Build application
8. Deploy to staging (preview branch)
9. Deploy to production (main branch)

## Scalability Considerations

### Horizontal Scaling
- Stateless Next.js instances
- Shared MongoDB cluster
- Shared Redis instance
- CDN for static assets

### Vertical Scaling
- Increase MongoDB cluster size
- Add read replicas for read-heavy workloads
- Scale Redis for higher rate limit throughput

### Future Enhancements
- Elasticsearch for advanced search
- CDN for image delivery
- Microservices for background jobs
- GraphQL API for mobile apps
