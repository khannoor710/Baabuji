# Baabuji E-commerce - Deployment Guide

This guide covers deploying Baabuji to production on Vercel with all required services.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup (Neon)](#database-setup-neon)
3. [Stripe Configuration](#stripe-configuration)
4. [Email Service (Resend)](#email-service-resend)
5. [Image Storage (Cloudinary)](#image-storage-cloudinary)
6. [Vercel Deployment](#vercel-deployment)
7. [Post-Deployment](#post-deployment)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

✅ **Before you begin, ensure you have:**

- [ ] GitHub repository with latest code
- [ ] Vercel account (free tier works)
- [ ] Neon account for PostgreSQL database
- [ ] Stripe account (test mode ready)
- [ ] Resend account for emails
- [ ] Cloudinary account for images

---

## Database Setup (Neon)

**Neon** is recommended for serverless PostgreSQL hosting.

### Steps:

1. **Create Neon Project**
   - Go to [Neon Console](https://console.neon.tech/)
   - Create new project: "baabuji-production"
   - Select region closest to your users (e.g., AWS US East)

2. **Get Connection String**
   ```
   postgres://username:password@ep-xyz.region.aws.neon.tech/neondb?sslmode=require
   ```
   - ⚠️ Enable connection pooling for Vercel:
   ```
   postgres://username:password@ep-xyz.pooler.region.aws.neon.tech/neondb?sslmode=require&pgbouncer=true
   ```

3. **Save for Later**
   - Copy the pooled connection string
   - You'll add this as `DATABASE_URL` in Vercel

---

## Stripe Configuration

### Test Mode Setup:

1. **Get API Keys**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/)
   - Developers → API keys
   - Copy:
     - Secret key: `sk_test_...`
     - Publishable key: `pk_test_...`

2. **Create Webhook Endpoint**
   - Go to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Copy webhook signing secret: `whsec_...`

3. **Enable Payment Methods**
   - Settings → Payment methods
   - Enable:
     - Cards (Visa, Mastercard, RuPay)
     - UPI (PhonePe, Google Pay, Paytm)
     - Netbanking (Indian banks)

### Production Mode (After Testing):

1. Switch to **Live Mode** in Stripe dashboard
2. Get new live API keys (`sk_live_...`, `pk_live_...`)
3. Update webhook endpoint with live signing secret
4. Update environment variables in Vercel

---

## Email Service (Resend)

### Setup:

1. **Create Resend Account**
   - Go to [Resend](https://resend.com/)
   - Sign up for free (3,000 emails/month)

2. **Verify Domain** (Optional but recommended)
   - Settings → Domains → Add Domain
   - Add DNS records to your domain provider
   - Verify domain ownership

3. **Get API Key**
   - Settings → API Keys → Create API Key
   - Copy: `re_...`

4. **Test Email**
   ```bash
   curl -X POST https://api.resend.com/emails \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"from":"orders@baabuji.com","to":"test@example.com","subject":"Test","html":"<p>Test email</p>"}'
   ```

---

## Image Storage (Cloudinary)

### Setup:

1. **Create Cloudinary Account**
   - Go to [Cloudinary](https://cloudinary.com/)
   - Sign up for free (25GB storage, 25GB bandwidth/month)

2. **Get Credentials**
   - Dashboard → Account Details
   - Copy:
     - Cloud Name: `your-cloud-name`
     - API Key: `123456789012345`
     - API Secret: `abcdefghijklmnopqrstuvwxyz`

3. **Create Upload Preset** (Optional)
   - Settings → Upload → Upload presets
   - Add preset for "baabuji/products" folder
   - Enable unsigned uploads if needed

4. **Environment URL**
   ```
   CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
   ```

---

## Vercel Deployment

### 1. Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. New Project → Import Git Repository
3. Select "baabuji" repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 2. Add Environment Variables

In Vercel project settings, add all environment variables:

```env
# Database
DATABASE_URL=postgres://user:pass@host.pooler.region.aws.neon.tech/neondb?sslmode=require&pgbouncer=true

# Authentication
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://yourdomain.vercel.app

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend Email
RESEND_API_KEY=re_...
EMAIL_FROM=orders@baabuji.com

# Cloudinary
CLOUDINARY_URL=cloudinary://key:secret@cloud
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnop

# App
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.vercel.app
```

**⚠️ Important:**
- For production, use Stripe **live** keys (`sk_live_...`)
- Generate `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- Update `NEXT_PUBLIC_APP_URL` with your custom domain

### 3. Run Database Migrations

**Option A: Via Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel env pull .env.production
npm run prisma:migrate -- --name production_init
```

**Option B: Manually in Neon**
```bash
# Connect to Neon database
psql "postgres://user:pass@host.region.aws.neon.tech/neondb?sslmode=require"

# Copy migration SQL from:
# prisma/migrations/*/migration.sql

# Run the SQL manually
```

**Option C: Use Vercel Postgres (Alternative to Neon)**
- Install: `npm install @vercel/postgres`
- Run: `npx prisma db push` (for schema sync)

### 4. Deploy!

```bash
# Push to main branch
git add .
git commit -m "Ready for production"
git push origin main

# Vercel will auto-deploy
```

---

## Post-Deployment

### 1. Verify Deployment

✅ **Check these URLs:**

- Homepage: `https://yourdomain.vercel.app/`
- Shop page: `/shop`
- Product detail: `/product/cotton-solid-men-unstitched`
- Cart: `/cart`
- Checkout: `/checkout`
- Admin: `/admin` (login as admin)
- API health: `/api/products` (should return JSON)

### 2. Seed Database

```bash
# SSH into Vercel or run locally with production DB
npm run prisma:seed

# Or create admin user manually via SQL:
INSERT INTO users (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@baabuji.com',
  'Admin',
  '$2a$10$...',  -- hash of 'admin123'
  'ADMIN',
  NOW(),
  NOW()
);
```

### 3. Test Stripe Webhook

```bash
# Use Stripe CLI for testing
stripe listen --forward-to https://yourdomain.vercel.app/api/webhooks/stripe

# Place test order with card: 4242 4242 4242 4242
# Check Vercel logs for webhook events
```

### 4. Send Test Email

- Register new account
- Check inbox for welcome email
- Place COD order
- Verify order confirmation email

### 5. Upload Test Product Image

- Login as admin
- Go to `/admin/products/new`
- Upload image (should upload to Cloudinary)
- Verify image displays on product page

---

## Monitoring & Maintenance

### Error Tracking

**Option 1: Sentry (Recommended)**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**Option 2: Vercel Logs**
- Dashboard → Project → Logs
- Filter by "Error" severity

### Performance Monitoring

1. **Vercel Analytics**
   - Enable in project settings
   - Track Core Web Vitals

2. **Vercel Speed Insights**
   ```bash
   npm install @vercel/speed-insights
   ```

### Database Monitoring

- **Neon Dashboard**: Monitor connection pool, query performance
- **Prisma Studio**: `npx prisma studio` (connect to production DB)

### Stripe Monitoring

- **Dashboard → Payments**: Track successful/failed payments
- **Dashboard → Webhooks**: Check delivery status

### Backup Strategy

1. **Database Backups**
   - Neon automatically backs up daily
   - Manual backup: `pg_dump` via SQL

2. **Environment Variables**
   - Keep `.env.production.backup` file locally (encrypted)

3. **Code Backups**
   - GitHub repository (always up-to-date)

---

## Rollback Procedures

### Revert Deployment

```bash
# Via Vercel Dashboard
# Deployments → Select previous deployment → Promote to Production

# Or via CLI
vercel rollback
```

### Database Rollback

```bash
# If migration fails
npx prisma migrate resolve --rolled-back <migration-name>

# Restore from backup
pg_restore -d production_db backup.sql
```

---

## Custom Domain Setup

1. **Add Domain in Vercel**
   - Project Settings → Domains → Add
   - Enter: `baabuji.com`

2. **Configure DNS**
   - Add CNAME record:
     ```
     @ → cname.vercel-dns.com
     www → cname.vercel-dns.com
     ```

3. **Update Environment Variables**
   ```
   NEXTAUTH_URL=https://baabuji.com
   NEXT_PUBLIC_APP_URL=https://baabuji.com
   ```

4. **Update Stripe Webhook**
   - Change URL to: `https://baabuji.com/api/webhooks/stripe`

---

## Security Checklist

- [ ] All environment variables set correctly
- [ ] `NEXTAUTH_SECRET` is strong and unique
- [ ] Stripe webhook signature verified
- [ ] Database connection uses SSL (`sslmode=require`)
- [ ] CORS configured properly
- [ ] Rate limiting enabled (TODO: implement)
- [ ] HTTPS enforced (Vercel automatic)
- [ ] Sensitive routes protected by middleware
- [ ] SQL injection prevented (Prisma ORM)
- [ ] XSS prevented (React automatic escaping)

---

## Troubleshooting

### Issue: "Can't connect to database"
- ✅ Check `DATABASE_URL` is correct
- ✅ Verify Neon database is active
- ✅ Ensure connection pooling enabled (`?pgbouncer=true`)

### Issue: "Stripe webhook failed"
- ✅ Check webhook signing secret matches
- ✅ Verify endpoint is accessible: `/api/webhooks/stripe`
- ✅ Check Vercel logs for errors

### Issue: "Email not sending"
- ✅ Verify `RESEND_API_KEY` is correct
- ✅ Check email sender address is verified
- ✅ Look for Resend API errors in logs

### Issue: "Image upload fails"
- ✅ Check Cloudinary credentials
- ✅ Verify file size < 5MB
- ✅ Ensure file type is jpg/png/webp

---

## Cost Estimates (Free Tiers)

| Service    | Free Tier                  | Estimated Monthly Cost |
|------------|----------------------------|------------------------|
| Vercel     | 100GB bandwidth, unlimited deployments | $0 |
| Neon       | 0.5GB storage, 10 branches | $0 |
| Stripe     | No monthly fee (pay per transaction) | ~3% per transaction |
| Resend     | 3,000 emails/month         | $0 |
| Cloudinary | 25GB storage, 25GB bandwidth | $0 |
| **Total**  | **For small-scale operations** | **$0/month** |

**Upgrade when:**
- Vercel: > 100GB bandwidth/month → $20/month Pro plan
- Neon: > 0.5GB database → $19/month Scale plan
- Resend: > 3,000 emails/month → $20/month
- Cloudinary: > 25GB bandwidth/month → $99/month Plus plan

---

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Support**: https://vercel.com/support
- **Prisma Docs**: https://www.prisma.io/docs
- **Stripe India Docs**: https://stripe.com/docs/india
- **Resend Docs**: https://resend.com/docs

---

## Checklist Before Going Live

- [ ] All environment variables configured
- [ ] Database migrated and seeded
- [ ] Stripe webhooks tested
- [ ] Email sending verified
- [ ] Image uploads working
- [ ] Admin account created
- [ ] Test orders placed successfully
- [ ] Mobile responsiveness checked
- [ ] SEO metadata added
- [ ] Analytics configured
- [ ] Error monitoring setup
- [ ] Backup procedures documented
- [ ] Security checklist completed
- [ ] Performance optimized (< 3s load time)
- [ ] Legal pages added (Terms, Privacy)
- [ ] Customer support email configured

---

**🎉 Congratulations! Your Baabuji e-commerce store is now live!**

For questions or issues, contact: dev@baabuji.com
