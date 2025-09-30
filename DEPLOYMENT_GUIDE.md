# TakaTena Production Deployment Guide

**Last Updated**: Production Readiness Review
**Deployment Platform**: Vercel
**Status**: ✅ Ready for Deployment

---

## 📋 Pre-Deployment Checklist

### Code Readiness ✅
- [x] All TypeScript errors resolved
- [x] ESLint warnings addressed
- [x] Security audit completed (see SECURITY_AUDIT.md)
- [x] Performance audit completed (see PERFORMANCE_AUDIT.md)
- [x] Testing checklist prepared (see PRODUCTION_CHECKLIST.md)

### Configuration ✅
- [x] `next.config.mjs` optimized with security headers
- [x] API route caching configured
- [x] Image optimization configured
- [x] Environment variables documented

### Documentation ✅
- [x] README.md complete
- [x] Environment variable requirements documented
- [x] Deployment guide created
- [x] Security audit documented
- [x] Performance benchmarks established

---

## 🚀 Deployment Steps

### Step 1: Database Setup (Neon PostgreSQL)

#### 1.1 Create Neon Account
1. Go to [neon.tech](https://neon.tech)
2. Sign up for a free account
3. Verify your email address

#### 1.2 Create Production Database
1. Click "Create Project"
2. **Project Name**: `takatena-production`
3. **Region**: Choose closest to your users (e.g., AWS us-east-1 for global, eu-west-1 for Europe)
4. **PostgreSQL Version**: 15 or latest
5. Click "Create Project"

#### 1.3 Get Connection String
1. Once created, copy the connection string
2. Format: `postgresql://[user]:[password]@[host]/[database]?sslmode=require`
3. Save this for later (Step 3)

#### 1.4 Run Database Migrations
```bash
# Set DATABASE_URL temporarily for migration
$env:DATABASE_URL="postgresql://..." # Windows PowerShell
# or
export DATABASE_URL="postgresql://..." # Mac/Linux

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Verify database
npx prisma studio
```

**Important**: Keep Prisma Studio open to verify tables were created:
- `User` table with all fields
- `Listing` table with all fields
- Proper indexes and relations

---

### Step 2: Vercel Blob Storage Setup

#### 2.1 Create Vercel Blob Store
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Navigate to "Storage" tab
3. Click "Create Database" → "Blob"
4. **Store Name**: `takatena-images`
5. Click "Create"

#### 2.2 Get Access Token
1. Once created, go to "Settings" tab
2. Find "BLOB_READ_WRITE_TOKEN"
3. Copy the token (format: `vercel_blob_rw_...`)
4. Save for Step 3

---

### Step 3: Vercel Project Setup

#### 3.1 Connect GitHub Repository
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. If not connected, authorize Vercel to access GitHub

#### 3.2 Configure Project Settings
**Framework Preset**: Next.js (auto-detected)
**Root Directory**: `./takatena` (if in a monorepo, otherwise leave as `./`)
**Build Command**: `npm run build` (default)
**Output Directory**: `.next` (default)
**Install Command**: `npm install` (default)

#### 3.3 Set Environment Variables

Click "Environment Variables" and add the following:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `DATABASE_URL` | `postgresql://...` (from Step 1.3) | Production |
| `NEXTAUTH_URL` | `https://takatena.co.ke` (your domain) | Production |
| `NEXTAUTH_SECRET` | `[generate strong secret]` | Production |
| `BLOB_READ_WRITE_TOKEN` | `vercel_blob_rw_...` (from Step 2.2) | Production |

**Generate NEXTAUTH_SECRET**:
```bash
# Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Mac/Linux
openssl rand -base64 32
```

**Important Notes**:
- ✅ Use different `NEXTAUTH_SECRET` than development
- ✅ Ensure `NEXTAUTH_URL` matches your production domain (without trailing slash)
- ✅ Keep `DATABASE_URL` connection string secure
- ✅ Don't share tokens publicly

#### 3.4 Deploy
1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Vercel will provide a temporary URL: `https://takatena-xxx.vercel.app`

---

### Step 4: Verify Deployment

#### 4.1 Initial Testing
1. Visit the deployment URL
2. Check homepage loads correctly
3. Verify no console errors (F12 → Console)
4. Test navigation between pages

#### 4.2 Critical Flow Testing

**Sign Up Flow**:
```
1. Go to /signup
2. Fill in registration form
3. Submit and verify redirect to dashboard
4. Check user created in database (Prisma Studio)
```

**Login Flow**:
```
1. Log out if logged in
2. Go to /login
3. Enter credentials from sign up
4. Verify redirect to dashboard
5. Check session persists on refresh
```

**Create Listing Flow**:
```
1. Log in
2. Go to /listings/create
3. Fill in all required fields
4. Upload 1-2 test images
5. Submit and verify success
6. Check listing appears in dashboard
7. Verify images load from Vercel Blob
```

**Browse & Search**:
```
1. Go to /browse
2. Verify listings display
3. Test filters (material type, location)
4. Test search functionality
5. Click listing to view detail
6. Verify contact buttons work (tel:, wa.me, mailto:)
```

#### 4.3 Database Verification
```bash
# Connect to production database
$env:DATABASE_URL="[production-url]"
npx prisma studio

# Verify:
✅ Users created via signup appear
✅ Listings have correct data
✅ Image URLs are from Vercel Blob
✅ Relationships correct (user ↔ listings)
```

---

### Step 5: Custom Domain Setup

#### 5.1 Add Domain to Vercel
1. In Vercel dashboard, go to project settings
2. Click "Domains" tab
3. Click "Add Domain"
4. Enter: `takatena.co.ke`
5. Add `www.takatena.co.ke` as well (optional)

#### 5.2 Configure DNS Records

**If domain is with a registrar (e.g., GoDaddy, Namecheap)**:

Add these DNS records:

**For apex domain (takatena.co.ke)**:
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**For www subdomain**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Recommended: Add www redirect**:
- In Vercel, set `www.takatena.co.ke` to redirect to `takatena.co.ke`

#### 5.3 Verify Domain
1. Wait for DNS propagation (5-60 minutes)
2. Check domain status in Vercel (should show "Valid Configuration")
3. Vercel automatically provisions SSL certificate
4. Test `https://takatena.co.ke` loads correctly

#### 5.4 Update Environment Variable
1. Go to Vercel project → Settings → Environment Variables
2. Update `NEXTAUTH_URL` to `https://takatena.co.ke`
3. Redeploy the project for changes to take effect

---

### Step 6: Post-Deployment Configuration

#### 6.1 Enable Vercel Analytics
1. In Vercel project settings
2. Go to "Analytics" tab
3. Click "Enable Analytics"
4. Choose plan (free tier available)
5. Monitors Web Vitals (LCP, FID, CLS)

#### 6.2 Set Up Error Tracking (Optional)

**Option A: Sentry**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**Option B: LogRocket**
```bash
npm install logrocket
npm install logrocket-react
```

Follow provider setup instructions.

#### 6.3 Configure Monitoring

**Uptime Monitoring** (Free options):
- [UptimeRobot](https://uptimerobot.com) - 50 monitors free
- [Freshping](https://freshping.io) - Unlimited free
- [StatusCake](https://statuscake.com) - Free tier

**Setup**:
1. Create account
2. Add monitor for `https://takatena.co.ke`
3. Set check interval (5 minutes recommended)
4. Configure alerts (email/SMS)

#### 6.4 Database Backups

**Neon Automatic Backups**:
- Free tier: 7 days retention
- Paid tier: 30 days retention
- Point-in-time recovery available

**Manual Backup** (recommended for critical deployments):
```bash
# Backup database
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Schedule weekly backups (optional)
# Use GitHub Actions, cron job, or Vercel CRON
```

---

## 🔒 Security Post-Deployment

### SSL/HTTPS ✅
- [x] Vercel provides automatic SSL (Let's Encrypt)
- [x] HTTPS enforced by default
- [x] HTTP redirects to HTTPS

### Security Headers ✅
- [x] Configured in `next.config.mjs`:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: origin-when-cross-origin`

### Environment Variables ✅
- [x] All secrets stored in Vercel dashboard
- [x] Not exposed in client-side code
- [x] Production secrets different from development

### Regular Security Tasks
- [ ] Weekly: Check for dependency updates (`npm audit`)
- [ ] Monthly: Review access logs for anomalies
- [ ] Quarterly: Rotate secrets (NEXTAUTH_SECRET, tokens)
- [ ] Yearly: Full security audit

---

## ⚡ Performance Post-Deployment

### Run Lighthouse Audit
1. Open site in Chrome
2. F12 → Lighthouse tab
3. Run audit with:
   - Device: Mobile & Desktop
   - Categories: Performance, Accessibility, Best Practices, SEO
4. Target scores:
   - Performance: 90+
   - Accessibility: 100
   - Best Practices: 95+
   - SEO: 95+

### Monitor Web Vitals
1. Vercel Analytics dashboard
2. Track:
   - **LCP** (Largest Contentful Paint): Target < 2.5s
   - **FID** (First Input Delay): Target < 100ms
   - **CLS** (Cumulative Layout Shift): Target < 0.1

### PageSpeed Insights
1. Go to [pagespeed.web.dev](https://pagespeed.web.dev)
2. Enter production URL
3. Analyze mobile and desktop performance
4. Address any flagged issues

---

## 📊 Production Monitoring

### Daily Checks (First Week)
- [ ] Site uptime (via monitoring service)
- [ ] Error rate in logs
- [ ] User signup/login success rate
- [ ] Image upload success rate

### Weekly Checks
- [ ] Performance metrics (Web Vitals)
- [ ] Database query performance (slow query log)
- [ ] Storage usage (Vercel Blob)
- [ ] Database size (Neon dashboard)

### Monthly Reviews
- [ ] User growth and engagement
- [ ] Feature usage analytics
- [ ] Error trends and patterns
- [ ] Performance optimization opportunities

---

## 🔧 Troubleshooting

### Build Failures

**Issue**: Build fails during deployment
```
Error: TypeScript compilation errors
```
**Solution**:
```bash
# Locally test production build
npm run build

# Fix any TypeScript errors
npm run lint

# Commit and push fixes
```

---

**Issue**: Prisma client generation fails
```
Error: Prisma Client could not be generated
```
**Solution**:
```bash
# Ensure build command includes Prisma generation
# Update Vercel build command to:
npx prisma generate && next build
```

---

### Database Connection Issues

**Issue**: Can't connect to database
```
Error: P1001 Can't reach database server
```
**Solution**:
1. Verify `DATABASE_URL` in Vercel environment variables
2. Check Neon database is active (not suspended)
3. Ensure connection string includes `?sslmode=require`
4. Check IP whitelist (Neon accepts all IPs by default)

---

### Authentication Issues

**Issue**: Login/signup redirects to error page
```
Error: Invalid OAuth configuration
```
**Solution**:
1. Verify `NEXTAUTH_URL` matches production domain exactly
2. Ensure `NEXTAUTH_SECRET` is set and strong (32+ characters)
3. Check `authOptions` configuration in `lib/auth.ts`
4. Clear browser cookies and try again

---

### Image Upload Failures

**Issue**: Images fail to upload
```
Error: Failed to upload image
```
**Solution**:
1. Verify `BLOB_READ_WRITE_TOKEN` is correct in Vercel
2. Check Vercel Blob store exists and is active
3. Test file size < 2MB and type is jpg/png/webp
4. Review Vercel Blob usage limits (free tier: 500MB)

---

### Performance Issues

**Issue**: Slow page load times
```
LCP > 4 seconds
```
**Solution**:
1. Check database query performance (Neon dashboard)
2. Verify images are optimized (< 200KB each)
3. Review API response times (Vercel logs)
4. Consider upgrading database plan if needed
5. Add more aggressive caching

---

### Domain/SSL Issues

**Issue**: Domain not resolving or SSL errors
```
Error: NET::ERR_CERT_COMMON_NAME_INVALID
```
**Solution**:
1. Verify DNS records are correct (A or CNAME)
2. Wait for DNS propagation (up to 48 hours, usually < 1 hour)
3. Check domain status in Vercel (should be "Valid")
4. If SSL error persists, contact Vercel support

---

## 🚨 Emergency Procedures

### Rollback Deployment
1. Go to Vercel project dashboard
2. Click "Deployments" tab
3. Find last working deployment
4. Click "..." → "Promote to Production"
5. Confirm rollback

### Database Restore
```bash
# If you have a backup
psql $DATABASE_URL < backup-20250101.sql

# Or use Neon's point-in-time recovery
# Via Neon dashboard: Backups → Restore
```

### Emergency Contacts
- **Vercel Support**: support@vercel.com (Enterprise) or community forum
- **Neon Support**: Via dashboard chat or support@neon.tech
- **Critical Security Issue**: Report immediately, take site offline if necessary

---

## 📈 Growth & Scaling

### When to Scale

**Database** (upgrade from free tier when):
- > 5,000 active users
- > 100,000 listings
- Query response time > 500ms
- Storage > 3GB

**Hosting** (upgrade Vercel plan when):
- > 100GB bandwidth/month
- > 1,000 deployments/month
- Need more serverless function execution time
- Need team collaboration features

**Storage** (upgrade Blob storage when):
- > 500MB stored
- > 100GB bandwidth/month for images

### Scaling Strategies

**Database Optimization**:
1. Add connection pooling (PgBouncer via Neon)
2. Implement read replicas for heavy read loads
3. Add Redis caching for frequently accessed data
4. Optimize indexes based on slow query log

**API Optimization**:
1. Implement Redis for session storage
2. Add rate limiting to prevent abuse
3. Use edge caching for static content
4. Implement background job processing

**Storage Optimization**:
1. Implement image CDN (Cloudflare, Cloudinary)
2. Add lazy loading for images
3. Compress images more aggressively
4. Archive old/unused images

---

## ✅ Deployment Completion Checklist

### Core Deployment ✅
- [ ] Database created and migrated (Neon)
- [ ] Blob storage configured (Vercel)
- [ ] Project deployed on Vercel
- [ ] Environment variables set correctly
- [ ] Custom domain configured with SSL
- [ ] All environment variables updated for custom domain

### Testing ✅
- [ ] Sign up flow works in production
- [ ] Login flow works in production
- [ ] Create listing with images works
- [ ] Browse and search work correctly
- [ ] All images load from Vercel Blob
- [ ] Contact buttons functional (tel:, wa.me, mailto:)
- [ ] Mobile responsiveness verified
- [ ] All protected routes redirect properly

### Monitoring & Security ✅
- [ ] Vercel Analytics enabled
- [ ] Uptime monitoring configured
- [ ] Error tracking set up (optional)
- [ ] SSL certificate active
- [ ] Security headers verified
- [ ] Database backups confirmed

### Performance ✅
- [ ] Lighthouse audit score 90+
- [ ] PageSpeed Insights tested
- [ ] Web Vitals in "Good" range
- [ ] API response times < 500ms
- [ ] Image optimization verified

### Documentation ✅
- [ ] README updated with production URL
- [ ] Team trained on deployment process
- [ ] Backup/restore procedure documented
- [ ] Emergency contacts established

---

## 🎉 Launch Announcement

### Pre-Launch
- [ ] Test all critical flows one final time
- [ ] Prepare marketing materials
- [ ] Set up social media accounts
- [ ] Draft launch announcement

### Launch Day
- [ ] Announce on social media (Twitter, LinkedIn, Facebook)
- [ ] Send email to early users (if applicable)
- [ ] Post on relevant Kenyan tech communities
- [ ] Submit to Kenyan startup directories
- [ ] Monitor for any issues

### Post-Launch (Week 1)
- [ ] Gather user feedback
- [ ] Fix any reported bugs immediately
- [ ] Monitor performance and errors
- [ ] Engage with early users
- [ ] Plan feature improvements based on feedback

---

## 📞 Support Resources

### Documentation
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Neon: [neon.tech/docs](https://neon.tech/docs)
- Prisma: [prisma.io/docs](https://prisma.io/docs)

### Community
- Next.js Discord: [discord.gg/nextjs](https://discord.gg/nextjs)
- Vercel Community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- Prisma Slack: [slack.prisma.io](https://slack.prisma.io)

### Paid Support (if needed)
- Vercel Pro/Enterprise: Priority support
- Neon Support: Available with paid plans
- Professional consulting: Consider for complex issues

---

## 🏆 Success Criteria

**Technical Success**:
- ✅ 99.9% uptime
- ✅ < 3s average page load time
- ✅ < 1% error rate
- ✅ All Core Web Vitals in "Good" range

**Business Success**:
- User signups growing steadily
- Listings being created regularly
- Users successfully exchanging materials
- Positive user feedback

**Deployment Complete**: ✅ **READY FOR PRODUCTION**

---

*Deployment Guide Version 1.0*
*For TakaTena Production Deployment*
*Platform: Vercel + Neon + Vercel Blob*