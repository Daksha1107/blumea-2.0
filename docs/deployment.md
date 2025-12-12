# Deployment Guide

This guide covers deploying the Blumea 2.0 application to various platforms.

## Prerequisites

Before deploying, ensure you have:

1. ✅ A MongoDB database (MongoDB Atlas recommended)
2. ✅ All environment variables configured
3. ✅ Redis instance (optional, for rate limiting and queues)
4. ✅ Domain name and SSL certificate

## Environment Variables

### Required Variables

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DBNAME=blumea
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://yourdomain.com
```

### Optional Variables

```bash
# Observability
SENTRY_DSN=https://...@sentry.io/...
GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# Rate Limiting & Queues
REDIS_URL=redis://...
# OR use Upstash
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...
```

## Deployment Platforms

### Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Configure Environment Variables**
```bash
vercel env add MONGODB_URI production
vercel env add MONGODB_DBNAME production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
```

4. **Deploy**
```bash
vercel --prod
```

### Docker

1. **Create Dockerfile**
```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

2. **Build and Run**
```bash
docker build -t blumea:latest .
docker run -p 3000:3000 --env-file .env blumea:latest
```

### AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Connect your GitHub repository

2. **Configure Build Settings**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

3. **Set Environment Variables**
   - Add all required environment variables in Amplify Console

### Self-Hosted (Ubuntu Server)

1. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Install PM2**
```bash
sudo npm install -g pm2
```

3. **Clone and Setup**
```bash
git clone https://github.com/Daksha1107/blumea-2.0.git
cd blumea-2.0
npm install
npm run build
```

4. **Configure Environment**
```bash
cp .env.example .env
nano .env  # Edit with your values
```

5. **Start with PM2**
```bash
pm2 start npm --name "blumea" -- start
pm2 save
pm2 startup
```

6. **Setup Nginx**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Post-Deployment

### 1. Run Migrations
```bash
npm run migrate
```

### 2. Seed Initial Data
```bash
npm run seed
npm run seed:admin
```

### 3. Verify Deployment

Check these endpoints:
- ✅ `https://yourdomain.com` - Homepage loads
- ✅ `https://yourdomain.com/blog` - Blog page loads
- ✅ `https://yourdomain.com/api/search?q=test` - Search API works
- ✅ `https://yourdomain.com/sitemap.xml` - Sitemap generates
- ✅ `https://yourdomain.com/robots.txt` - Robots.txt serves

### 4. Test Admin Access
- ✅ Navigate to `/admin`
- ✅ Login with admin credentials
- ✅ Dashboard loads correctly

### 5. Security Checklist
- ✅ HTTPS enabled
- ✅ Environment variables secured
- ✅ Admin password changed from default
- ✅ Security headers present (check with securityheaders.com)
- ✅ CSP configured correctly
- ✅ Rate limiting active (test with API calls)

## Monitoring

### Set up monitoring for:

1. **Uptime Monitoring**
   - Use UptimeRobot or similar
   - Monitor homepage and API endpoints

2. **Error Tracking**
   - Configure Sentry DSN
   - Monitor error rates

3. **Performance**
   - Set up Google Analytics
   - Monitor Core Web Vitals
   - Use Lighthouse for audits

4. **Database**
   - Monitor MongoDB Atlas metrics
   - Set up alerts for high CPU/memory
   - Regular backups

## Scaling

### Horizontal Scaling

1. **Use Load Balancer**
   - Deploy multiple instances
   - Configure load balancer (AWS ELB, Nginx)

2. **Database Scaling**
   - Use MongoDB replica sets
   - Enable read replicas

3. **Caching**
   - Use Redis for caching
   - Enable CDN (Cloudflare, Fastly)

### Vertical Scaling

- Increase server resources
- Optimize MongoDB indexes
- Enable Next.js image optimization

## Rollback Procedure

If deployment fails:

1. **Vercel**: Use dashboard to rollback to previous deployment
2. **Docker**: Pull previous image version
3. **PM2**: 
```bash
pm2 stop blumea
git checkout <previous-commit>
npm install
npm run build
pm2 restart blumea
```

## Troubleshooting

### Build Fails

1. Check Node.js version (must be 20.x)
2. Clear `node_modules` and `.next`
3. Run `npm ci` instead of `npm install`

### Database Connection Issues

1. Check MongoDB URI format
2. Verify IP whitelist in MongoDB Atlas
3. Test connection with mongo shell

### Authentication Issues

1. Verify `NEXTAUTH_SECRET` is set
2. Check `NEXTAUTH_URL` matches deployment URL
3. Clear browser cookies

### Performance Issues

1. Enable Next.js caching
2. Optimize images
3. Enable compression in Nginx/server
4. Use CDN for static assets

## Support

For deployment issues:
- Check logs: `pm2 logs blumea` (PM2)
- Review Vercel logs in dashboard
- Check MongoDB Atlas logs
- Contact support team

## Security Considerations

### Production Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured (not in code)
- [ ] Admin password changed
- [ ] Database credentials rotated
- [ ] Firewall configured
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Regular security updates scheduled
- [ ] Backup system configured
- [ ] Monitoring alerts configured

## Maintenance

### Regular Tasks

- **Daily**: Monitor error rates and uptime
- **Weekly**: Review security alerts
- **Monthly**: Database backups verification
- **Quarterly**: Security audit, dependency updates

### Update Procedure

1. Test updates in staging environment
2. Create database backup
3. Deploy to production
4. Run smoke tests
5. Monitor for 24 hours
6. Rollback if issues detected
