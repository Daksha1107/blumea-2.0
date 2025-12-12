# Blumea 2.0 - Production-Grade Skincare Blog

A modern, SEO-optimized Next.js 14 application for skincare reviews and wellness content. Built with TypeScript, MongoDB, and comprehensive security features.

## 🚀 Features

### Core Features
- ✅ **SEO-First Architecture**: Comprehensive metadata, JSON-LD, sitemaps, and canonical URLs
- ✅ **Dark Theme UI**: Elegant design with gold/bronze accents (#c9a962)
- ✅ **MongoDB Integration**: Real database with full CRUD operations
- ✅ **Full-Text Search**: MongoDB text search with relevance scoring
- ✅ **Rate Limiting**: IP-based rate limiting with Upstash Redis
- ✅ **Background Jobs**: Queue-based article publishing with BullMQ

### Security Features
- ✅ **Environment Validation**: Fails fast on missing required env vars in production
- ✅ **Authentication & RBAC**: NextAuth with role-based access control
- ✅ **XSS Protection**: HTML sanitization with sanitize-html
- ✅ **Security Headers**: CSP, X-Frame-Options, X-Content-Type-Options
- ✅ **Input Sanitization**: Server-side validation and sanitization

### Developer Experience
- ✅ **TypeScript**: Full type safety
- ✅ **CI/CD Pipeline**: Automated lint, typecheck, and tests
- ✅ **Testing**: Unit tests (Vitest) and E2E tests (Playwright)
- ✅ **Observability**: Sentry integration and structured logging
- ✅ **Hot Reload**: Fast development with Next.js

## 📋 Prerequisites

- Node.js 20.x or higher
- MongoDB 6.x or higher
- Redis (optional, for rate limiting and queues)

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/Daksha1107/blumea-2.0.git
cd blumea-2.0
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DBNAME=blumea
NEXTAUTH_SECRET=your-secret-key-here-min-32-chars
NEXTAUTH_URL=http://localhost:3000
```

4. **Run database migrations**
```bash
npm run migrate
```

5. **Seed the database**
```bash
npm run seed
npm run seed:admin
```

6. **Start the development server**
```bash
npm run dev
```

Visit http://localhost:3000

## 🗄️ Database Setup

### Create Indexes
```bash
npm run migrate
```

### Seed Sample Data
```bash
npm run seed
```

### Create Admin User
```bash
npm run seed:admin
```

Default admin credentials:
- Email: admin@blumea.com
- Password: admin123
- **⚠️ CHANGE THIS IMMEDIATELY IN PRODUCTION!**

## 📦 Project Structure

```
blumea-2.0/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   ├── topics/            # Topic pages
│   ├── search/            # Search page
│   ├── admin/             # Admin dashboard
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts          # Robots.txt
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ArticleCard.tsx
│   └── ...
├── lib/                   # Core libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── rbac.ts           # Role-based access control
│   ├── mongodb.ts        # Database connection
│   ├── sanitize.ts       # HTML sanitization
│   ├── seo.ts            # SEO utilities
│   ├── search.ts         # Search functionality
│   ├── queue.ts          # Job queue
│   ├── rateLimit.ts      # Rate limiting
│   ├── logger.ts         # Structured logging
│   └── sentry.ts         # Error tracking
├── scripts/               # Utility scripts
│   ├── migrate.ts        # Database migrations
│   ├── seed.ts           # Seed sample data
│   └── seedAdmin.ts      # Create admin user
├── tests/                 # Test files
│   ├── unit/             # Unit tests
│   └── e2e/              # E2E tests
├── types/                 # TypeScript types
└── docs/                  # Documentation

## 🧪 Testing

### Run unit tests
```bash
npm test
```

### Run E2E tests
```bash
npm run test:e2e
```

### Lint
```bash
npm run lint
```

### Type check
```bash
npm run typecheck
```

## 🔐 Security

### Acceptance Criteria ✅
1. ✅ App exits with error if `MONGODB_URI` missing in production
2. ✅ Anonymous request to `/admin/*` returns 401
3. ✅ Insufficient role request returns 403
4. ✅ Saved article HTML has no script tags
5. ✅ Publish endpoint returns job ID
6. ✅ Article pages have og: meta, JSON-LD, canonical tags
7. ✅ Sitemap includes all locales with hreflang
8. ✅ Rate limit returns 429 with Retry-After

### Security Headers
All responses include:
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

## 🌐 Deployment

### Build for production
```bash
npm run build
```

### Start production server
```bash
npm start
```

### Environment Variables for Production
Ensure all required environment variables are set:
- `MONGODB_URI`
- `MONGODB_DBNAME`
- `NEXTAUTH_SECRET` (min 32 characters)
- `NEXTAUTH_URL`

Optional:
- `SENTRY_DSN` (for error tracking)
- `REDIS_URL` (for queues and rate limiting)
- `UPSTASH_REDIS_REST_URL` (alternative to REDIS_URL)
- `UPSTASH_REDIS_REST_TOKEN`

## 📚 Documentation

- [Backup & Restore Guide](./docs/backup-restore.md)
- [API Documentation](./docs/api.md) (coming soon)
- [Deployment Guide](./docs/deployment.md) (coming soon)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

See `.github/pull_request_template.md` for PR guidelines.

## 📄 License

This project is proprietary and confidential.

## 👥 Team

- [@Daksha1107](https://github.com/Daksha1107) - Project Owner

## 🐛 Known Issues

None at this time.

## 📞 Support

For issues and questions, please open a GitHub issue.