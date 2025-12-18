# Baabuji - Premium Unstitched Clothing E-commerce

A modern, full-featured e-commerce platform for premium unstitched fabrics built with Next.js, TypeScript, Prisma, and Stripe.

## 🌟 Features

- **Product Catalog**: Multi-criteria filtering (category, fabric, pattern, color, price)
- **Shopping Cart**: Persistent cart with localStorage + server sync
- **Checkout**: Stripe integration with UPI, Cards, NetBanking, and COD support
- **Authentication**: NextAuth.js with role-based access (Customer/Admin)
- **Admin Dashboard**: Product and order management
- **Email Notifications**: Order confirmations, shipping updates via Resend
- **Responsive Design**: Mobile-first with Tailwind CSS
- **SEO Optimized**: Dynamic metadata, sitemap, robots.txt

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Payments**: Stripe (INR support)
- **Styling**: Tailwind CSS
- **Email**: Resend + React Email
- **Images**: Cloudinary
- **Testing**: Vitest + Playwright

## 📋 Prerequisites

- Node.js 18.x or higher
- PostgreSQL database
- Stripe account (test mode)
- Resend account (optional for emails)
- Cloudinary account (optional for production images)

## 🚀 Getting Started

### 1. Clone and Install

\`\`\`bash
cd c:\\Personal\\Baabuji
npm install
\`\`\`

### 2. Environment Setup

Copy the example environment file:

\`\`\`bash
copy .env.example .env
\`\`\`

Update `.env` with your credentials:

- **Database**: Set up PostgreSQL and update `DATABASE_URL`
- **Auth**: Generate secret with `openssl rand -base64 32`
- **Stripe**: Add test API keys from dashboard
- **Resend**: Add API key for email (optional)
- **Cloudinary**: Add cloud name and URL (optional)

### 3. Database Setup

\`\`\`bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed sample data
npx prisma db seed
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript validation
- `npm test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npx prisma studio` - Open database browser

## 🗂️ Project Structure

\`\`\`
Baabuji/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (shop)/            # Shop pages (products, cart, checkout)
│   ├── account/           # User account pages
│   ├── admin/             # Admin dashboard
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
├── lib/                   # Utilities and helpers
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── utils.ts          # Helper functions
│   └── validations.ts    # Zod schemas
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data script
├── emails/               # React Email templates
└── __tests__/            # Test files
\`\`\`

## 🔑 Default Credentials (After Seeding)

**Admin Account**:
- Email: admin@baabuji.com
- Password: admin123

**Customer Account**:
- Email: customer@example.com
- Password: customer123

## 💳 Test Payment (Stripe)

Use these test cards in development:

- **Success**: 4242 4242 4242 4242
- **3D Secure**: 4000 0027 6000 3184
- **Decline**: 4000 0000 0000 0002

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Database Hosting

- **Recommended**: Neon (serverless PostgreSQL)
- Alternative: Supabase, Railway

Update `DATABASE_URL` with production connection string.

### Post-Deployment

- Run `npx prisma migrate deploy` on production DB
- Configure Stripe webhooks
- Set up Cloudinary for image hosting

## 📧 Email Configuration

Emails are sent via Resend. Templates are in `/emails` directory.

To test emails locally:
\`\`\`bash
npm run email:dev
\`\`\`

## 🧪 Testing

\`\`\`bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# With UI
npm run test:e2e:ui
\`\`\`

## 📝 License

Private project - All rights reserved

## 🤝 Contributing

This is a private project. For questions or issues, contact the maintainer.

## 📞 Support

For support, email support@baabuji.com

---

Built with ❤️ using Next.js and TypeScript

---

##  Iteration 4 Complete - Production Ready

**Status**: All systems operational | 124/124 tests passing | 0 TypeScript errors

### Quick Test Commands
\\\ash
npm test              # All unit/integration tests (3.3s)
npm run type-check    # TypeScript validation
npm run test:e2e      # Playwright E2E tests
\\\

### What Changed in Iteration 4
-  Fixed all TypeScript errors (11  0)
-  Implemented structured logging across all API routes
-  Added 20+ data-testid attributes for E2E testing
-  Configured Playwright with auto-start dev server
-  100% test pass rate maintained (124 tests)

**Full Details**: See [ITERATION_4_COMPLETE.md](ITERATION_4_COMPLETE.md)

---
