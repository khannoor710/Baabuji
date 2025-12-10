# Baabuji E-commerce Project - AI Agent Instructions

## Project Overview
**Baabuji** is a premium unstitched clothing e-commerce platform built with Next.js, TypeScript, Prisma, and Stripe. Target: South Asian/ethnic wear enthusiasts seeking quality fabrics.

## Tech Stack & Architecture
- **Framework**: Next.js (app router, TypeScript)
- **Styling**: Tailwind CSS with brand colors (deep brown/maroon primary, warm beige secondary, muted gold accent)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js (credentials provider, role-based access: CUSTOMER/ADMIN)
- **Payments**: Stripe (test mode, env-based config)
- **State**: React/Next built-in patterns (avoid Redux unless necessary)

## Project Structure
```
/app              # Next.js app router pages & API routes
/components       # Reusable UI components (ProductCard, FilterSidebar, etc.)
/lib              # Utilities, helpers, auth config
/prisma           # Schema, migrations, seed data
```

## Critical Data Models (Prisma)
**Core entities**: User, Address, Product, ProductImage, Order, OrderItem, Review, NewsletterSubscriber, ContactMessage

**Key relationships**:
- User → Address[] (with isDefaultShipping/isDefaultBilling flags)
- Product → ProductImage[] (isPrimary flag for main image)
- Order → OrderItem[] (product snapshots to preserve pricing/names)
- Products have category enum [MEN, WOMEN, KIDS, UNISEX] + pattern, fabricType, color metadata

**Order flow states**:
- Order.status: PENDING → PAID → SHIPPED → DELIVERED (or CANCELLED)
- Order.paymentStatus: PENDING → PAID/FAILED/REFUNDED

## Key Routes & Features
1. **Public**: `/` (home), `/shop` (filterable catalog), `/product/[slug]`, `/cart`, `/checkout`
2. **Auth-protected**: `/account` (profile, addresses, order history)
3. **Admin-only**: `/admin` (product/order management, role=ADMIN required)
4. **Auth**: `/auth/login`, `/auth/register`
5. **Info pages**: `/about`, `/contact`, `/faq`, `/terms`, `/privacy`

## Product Filtering & Search
Shop page implements multi-criteria filtering:
- Category (Men/Women/Kids), Fabric Type (Cotton/Linen/Silk/Blends), Pattern (Solid/Printed/Embroidered/Striped/Checks)
- Color tags, Price Range slider, In-stock availability
- Sorting: Newest, Price (Low/High), Featured
- Search by name/tags in navbar

## Cart & Checkout Flow
- Cart persists client-side (localStorage/cookies) + server sync for logged-in users
- Checkout creates Order (PENDING) → Stripe checkout session → on success: update to PAID, clear cart
- Stock validation at checkout (prevent overselling)
- API routes: `POST /api/cart`, `POST /api/checkout`, `GET /api/orders/[id]`

## Authentication & Authorization
- NextAuth middleware protects `/account/*` and `/admin/*`
- Register: validate email format, hash passwords with bcrypt
- Admin routes check `session.user.role === 'ADMIN'`
- Prefill saved addresses at checkout for logged-in users

## Branding & Design Conventions
**Visual identity**:
- Elegant, minimal, premium aesthetic with lots of white space
- Fonts: Serif/display for headings, clean sans-serif for body
- Product images: large, high-quality, zoom/hover capability
- Mobile-first responsive design

**UI Components**:
- Reusable: ProductCard, ProductGrid, FilterSidebar, SortDropdown, CartItem, OrderSummary, Button, Input, Select, Modal, Toast
- Layout: MainLayout with Header (logo, nav links, search, cart icon with count, user icon), Footer (FAQ/Terms/Privacy links, social icons, newsletter signup)

## SEO & Performance
- Dynamic metadata per page/product (titles, descriptions, Open Graph tags)
- Generate sitemap.xml and robots.txt
- Use Next.js `<Image />` component for optimization and lazy loading
- Pre-fetch main routes for faster navigation

## Currency & Localization
**Primary currency**: INR (Indian Rupee)
- Store prices in smallest unit (paise) to avoid decimal precision issues
- Display formatting: ₹2,499.00 (use `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`)
- Stripe supports INR in test mode (minimum charge: ₹0.50)
- **Payment methods to support**:
  - Cards (Visa, Mastercard, RuPay) via Stripe
  - UPI (PhonePe, Google Pay, Paytm) - Stripe payment method type: `upi`
  - Cash on Delivery (COD) - custom implementation with order status tracking
  - Netbanking - via Stripe India payment methods
- For COD orders: create Order with `paymentStatus: PENDING`, update to PAID on delivery confirmation
- Shipping calculations should account for Indian postal codes (6-digit format)
- Future-proof: store currency in Product model for potential multi-currency expansion

## Image Handling Strategy
**Admin product images**:
- **Recommended**: Cloudinary for production (free tier: 25GB storage, 25GB bandwidth/month)
- **Development**: Local uploads to `/public/products/` with Next.js static serving
- Image upload flow:
  1. Admin uploads via file input → validate format (jpg/png/webp), max 5MB
  2. Production: upload to Cloudinary, store URL in ProductImage.url
  3. Development: save to `/public/products/{productId}/`, store relative path
- Use Next.js `<Image />` with Cloudinary loader for automatic optimization
- Store multiple sizes: thumbnail (300px), detail (800px), zoom (1200px)
- ProductImage model tracks: url, altText, isPrimary, displayOrder
- Environment variable: `CLOUDINARY_URL` or `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

## Email Notifications
**Email service**: Resend (recommended for Next.js, 3000 emails/month free)
- **Transactional emails to implement**:
  1. Order confirmation (send immediately after payment)
  2. Order shipped notification (with tracking link)
  3. Order delivered confirmation
  4. Welcome email on registration
  5. Password reset (if implementing forgot password)
  6. Newsletter broadcasts (batch send to NewsletterSubscriber table)
- Email templates: use React Email for type-safe, component-based templates
- Create `/emails` directory with: `OrderConfirmation.tsx`, `OrderShipped.tsx`, `Welcome.tsx`, `Newsletter.tsx`
- API route: `POST /api/send-email` (server-side only)
- Environment variables: `RESEND_API_KEY`, `EMAIL_FROM` (e.g., orders@baabuji.com)
- Error handling: log failed emails to database table for retry/debugging
- For newsletter: implement unsubscribe link with token-based verification

## Environment Variables
Required in `.env`:
```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/baabuji

# Authentication
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# Payments
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
RESEND_API_KEY=re_...
EMAIL_FROM=orders@baabuji.com

# Images (Production)
CLOUDINARY_URL=cloudinary://...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

# Optional
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Developer Workflows
**Setup**: 
```bash
npm install
cp .env.example .env  # Configure all variables
npx prisma migrate dev  # Run migrations
npx prisma db seed  # Populate sample data
npm run dev  # Start dev server on localhost:3000
```

**Development**:
- `npm run dev` - Next.js dev server with hot reload
- `npx prisma studio` - Visual database browser (localhost:5555)
- `npm run lint` - ESLint validation
- `npm run type-check` - TypeScript compilation check

**Database**:
- `npx prisma migrate dev --name <description>` - Create new migration
- `npx prisma migrate reset` - Reset DB and re-run all migrations + seed
- `npx prisma generate` - Regenerate Prisma Client after schema changes
- `npx prisma db push` - Quick schema sync (dev only, skips migrations)

**Testing**:
- `npm test` - Run unit tests (Vitest)
- `npm run test:watch` - Watch mode for TDD
- `npm run test:e2e` - Playwright end-to-end tests
- `npm run test:coverage` - Generate coverage report

**Build & Deploy**:
- `npm run build` - Production build
- `npm start` - Start production server
- `npm run analyze` - Bundle size analysis (next-bundle-analyzer)

## Testing Strategy
**Framework setup**:
- **Unit/Integration**: Vitest (faster than Jest, native ESM support, compatible with Next.js)
- **E2E**: Playwright (cross-browser, built-in test runner)
- **Component testing**: React Testing Library with Vitest

**Test structure**:
```
/__tests__
  /unit          # Pure functions, utils
  /integration   # API routes, database operations
  /e2e           # Playwright specs
  /components    # React component tests
```

**Critical test coverage**:
1. **Auth flows** (`__tests__/integration/auth.test.ts`):
   - Registration with validation
   - Login with correct/incorrect credentials
   - Protected route access (middleware)
   - Role-based admin access control

2. **Cart operations** (`__tests__/integration/cart.test.ts`):
   - Add/remove/update cart items
   - Cart persistence (localStorage + server sync)
   - Stock validation on add-to-cart

3. **Checkout process** (`__tests__/e2e/checkout.spec.ts`):
   - Guest checkout flow
   - Logged-in user with saved addresses
   - Stock validation at checkout
   - Stripe test card payment: 4242 4242 4242 4242
   - Order creation and cart clearing
   - COD order placement

4. **Product filtering** (`__tests__/integration/products.test.ts`):
   - Multi-criteria filtering (category, fabric, pattern, price)
   - Search functionality
   - Sorting (price, newest, featured)

5. **Admin operations** (`__tests__/e2e/admin.spec.ts`):
   - Product CRUD (create, edit, delete)
   - Image upload and association
   - Order status updates
   - Access control (non-admin blocked)

**Test data**:
- Use separate test database: `DATABASE_URL_TEST` in `.env.test`
- Seed test data before E2E runs: `npx prisma db seed -- --test`
- Reset between test suites to ensure isolation

**Mocking**:
- Mock Stripe: use `@stripe/stripe-js` test mode with fixed token
- Mock Resend: intercept email sends in tests, verify content
- Mock Cloudinary: use local file system in test environment

## Deployment & Hosting
**Recommended platform**: Vercel (optimal for Next.js)

**Vercel-specific setup**:
- Auto-deploy on git push (main branch → production, feature branches → preview)
- Environment variables: configure in Vercel dashboard (all from `.env`)
- Build command: `npm run build` (default)
- Output directory: `.next` (default)
- Install command: `npm install` (default)
- Node.js version: 18.x or 20.x (specify in `package.json` engines)

**Database hosting**:
- **Recommended**: Neon (serverless Postgres, generous free tier, Vercel integration)
- Alternative: Supabase (Postgres + auth + storage)
- Update `DATABASE_URL` in Vercel env vars with connection string
- Enable connection pooling for serverless (append `?pgbouncer=true` to Neon URL)

**Pre-deployment checklist**:
1. Run `npm run build` locally to catch build errors
2. Test production build: `npm start` and verify functionality
3. Run migrations on production DB: `npx prisma migrate deploy`
4. Verify all environment variables set in Vercel
5. Test Stripe webhooks with Vercel webhook URL (use Stripe CLI for testing)
6. Configure custom domain and SSL (Vercel handles automatically)
7. Set up Cloudinary production account and update env vars

**Post-deployment**:
- Monitor Vercel Analytics for performance
- Set up Sentry or similar for error tracking (optional)
- Configure Vercel cron jobs for newsletter sends or cleanup tasks
- Enable Vercel security headers (CSP, HSTS, X-Frame-Options)

**Stripe webhook configuration**:
- Production webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
- Events to listen: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
- Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET` in Vercel

**Performance optimizations**:
- Enable Vercel Edge Caching for static pages (`/about`, `/faq`, etc.)
- Use ISR (Incremental Static Regeneration) for product pages: `revalidate: 3600`
- Optimize images with Vercel Image Optimization or Cloudinary
- Implement Redis caching for product listings (Vercel KV or Upstash)

## Seed Data Requirements
Prisma seed script should populate:
- Sample products across all categories (Men/Women/Kids) with varied fabrics, patterns, colors
- At least one admin user (role=ADMIN) and sample customer users
- Product images (use placeholder URLs if needed)
- Featured/best-seller flags on select products

## Error Handling & UX
- Toast notifications for: network errors, out-of-stock, payment failures, form validation
- Loading states: skeleton loaders for product grids, spinners for async actions
- Empty states: "No products found", "Cart is empty", "No orders yet"
- Accessible: alt text on images, ARIA labels, good color contrast

## Admin Dashboard Features
- Product CRUD: list with search/filter, create/edit forms with image upload
- Order management: list all orders, filter by status, view details, update status
- Simple metrics: total orders count, total revenue sum, recent orders widget

## Code Quality Standards
- TypeScript: strict typing, no implicit `any`
- Components: functional with hooks, prop types defined with interfaces/types
- API routes: validate inputs, handle errors gracefully, return consistent JSON responses
- Comments: document non-obvious logic, "why" not "what"
- File naming: kebab-case for components (`product-card.tsx`), camelCase for utils

## Testing Considerations
- Focus on critical paths: auth flows, cart operations, checkout process
- Test Stripe integration with test card: 4242 4242 4242 4242
- Verify stock deduction on order completion
- Ensure role-based access control prevents unauthorized admin access

## Integration Points
- **Stripe**: create checkout sessions, handle webhooks for payment confirmations (optional but recommended)
- **NextAuth**: session management, middleware protection, role checks
- **Prisma**: transaction wrapping for cart-to-order conversion (atomic stock updates)

## Common Pitfalls to Avoid
- Don't expose Stripe secret keys in client-side code
- Always snapshot product details in OrderItem (prices/names change over time)
- Validate cart stock availability at checkout, not just add-to-cart
- Use database transactions when creating orders to prevent race conditions
- Don't trust client-side role checks—always verify `session.user.role` server-side
