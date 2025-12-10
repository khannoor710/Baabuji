# Baabuji Project Structure

## 📁 Complete File Tree

```
Baabuji/
│
├── .github/
│   └── copilot-instructions.md       # AI coding assistant instructions
│
├── app/                               # Next.js App Router
│   ├── api/                          # API Routes
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   │   └── route.ts         # NextAuth handler
│   │   │   └── register/
│   │   │       └── route.ts         # User registration
│   │   ├── products/
│   │   │   └── route.ts             # Products API (list, filter, search)
│   │   ├── cart/
│   │   │   └── route.ts             # Cart operations
│   │   ├── checkout/
│   │   │   └── route.ts             # Checkout & order creation
│   │   ├── orders/
│   │   │   └── route.ts             # Order management
│   │   ├── webhooks/
│   │   │   └── stripe/
│   │   │       └── route.ts         # Stripe webhook handler
│   │   └── newsletter/
│   │       └── route.ts             # Newsletter subscription
│   │
│   ├── (shop)/                       # Shop route group
│   │   ├── shop/
│   │   │   └── page.tsx             # Product catalog with filters
│   │   ├── product/
│   │   │   └── [slug]/
│   │   │       └── page.tsx         # Product detail page
│   │   ├── cart/
│   │   │   └── page.tsx             # Shopping cart
│   │   └── checkout/
│   │       └── page.tsx             # Checkout page
│   │
│   ├── (auth)/                       # Auth route group
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx         # Login page
│   │   │   └── register/
│   │   │       └── page.tsx         # Registration page
│   │
│   ├── account/                      # Customer account (protected)
│   │   ├── page.tsx                 # Account dashboard
│   │   ├── orders/
│   │   │   └── page.tsx             # Order history
│   │   ├── addresses/
│   │   │   └── page.tsx             # Manage addresses
│   │   └── profile/
│   │       └── page.tsx             # Profile settings
│   │
│   ├── admin/                        # Admin dashboard (ADMIN only)
│   │   ├── page.tsx                 # Admin dashboard
│   │   ├── products/
│   │   │   ├── page.tsx             # Product list
│   │   │   ├── new/
│   │   │   │   └── page.tsx         # Create product
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx     # Edit product
│   │   └── orders/
│   │       ├── page.tsx             # Order list
│   │       └── [id]/
│   │           └── page.tsx         # Order details
│   │
│   ├── about/
│   │   └── page.tsx                 # About page
│   ├── contact/
│   │   └── page.tsx                 # Contact page
│   ├── faq/
│   │   └── page.tsx                 # FAQ page
│   ├── terms/
│   │   └── page.tsx                 # Terms & Conditions
│   ├── privacy/
│   │   └── page.tsx                 # Privacy Policy
│   │
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home page
│   └── globals.css                   # Global styles
│
├── components/                       # Reusable UI Components
│   ├── ui/                          # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── modal.tsx
│   │   ├── toast.tsx
│   │   └── loading.tsx
│   │
│   ├── product-card.tsx             # Product card component
│   ├── product-grid.tsx             # Product grid layout
│   ├── filter-sidebar.tsx           # Product filters
│   ├── sort-dropdown.tsx            # Sort options
│   ├── cart-item.tsx                # Cart item component
│   ├── order-summary.tsx            # Order summary
│   ├── header.tsx                   # Site header
│   ├── footer.tsx                   # Site footer
│   └── newsletter-form.tsx          # Newsletter subscription
│
├── lib/                              # Utilities & Helpers
│   ├── auth.ts                      # NextAuth configuration
│   ├── prisma.ts                    # Prisma client singleton
│   ├── utils.ts                     # Helper functions
│   ├── validations.ts               # Zod validation schemas
│   ├── stripe.ts                    # Stripe client & helpers
│   ├── cloudinary.ts                # Cloudinary image upload
│   └── email.ts                     # Email sending utilities
│
├── prisma/                           # Database
│   ├── schema.prisma                # Prisma schema
│   ├── seed.ts                      # Seed data script
│   └── migrations/                  # Migration files (auto-generated)
│
├── emails/                           # React Email Templates
│   ├── order-confirmation.tsx       # Order confirmation email
│   ├── order-shipped.tsx            # Shipping notification
│   ├── order-delivered.tsx          # Delivery confirmation
│   ├── welcome.tsx                  # Welcome email
│   └── newsletter.tsx               # Newsletter template
│
├── __tests__/                        # Tests
│   ├── setup.ts                     # Test setup
│   ├── unit/                        # Unit tests
│   │   ├── utils.test.ts
│   │   └── validations.test.ts
│   ├── integration/                 # Integration tests
│   │   ├── auth.test.ts
│   │   ├── cart.test.ts
│   │   └── products.test.ts
│   └── e2e/                         # E2E tests (Playwright)
│       ├── checkout.spec.ts
│       ├── auth.spec.ts
│       └── admin.spec.ts
│
├── public/                           # Static assets
│   ├── images/
│   ├── products/                    # Product images (dev only)
│   └── favicon.ico
│
├── .env.example                      # Environment variables template
├── .gitignore                        # Git ignore rules
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── postcss.config.js                 # PostCSS configuration
├── .eslintrc.json                    # ESLint configuration
├── vitest.config.ts                  # Vitest configuration
├── playwright.config.ts              # Playwright configuration
├── package.json                      # Dependencies & scripts
├── README.md                         # Project documentation
└── middleware.ts                     # NextAuth middleware
```

## 🔑 Key Directories Explained

### `/app` - Next.js App Router
- **Route groups** `(shop)`, `(auth)`: Organize routes without affecting URL structure
- **API routes**: RESTful endpoints for data operations
- **Dynamic routes**: `[slug]`, `[id]` for parameterized pages
- **Layouts**: Shared layouts for route groups

### `/components` - Reusable Components
- **ui/**: Base UI primitives (Button, Input, Modal)
- **Feature components**: ProductCard, FilterSidebar, CartItem
- **Layout components**: Header, Footer

### `/lib` - Business Logic & Utilities
- **auth.ts**: NextAuth configuration & session handling
- **prisma.ts**: Database client singleton
- **utils.ts**: Currency formatting, date formatting, slug generation
- **validations.ts**: Zod schemas for form validation

### `/prisma` - Database Layer
- **schema.prisma**: Database models and relationships
- **seed.ts**: Sample data for development
- **migrations/**: Version-controlled schema changes

### `/emails` - Transactional Emails
- React Email templates for customer communications
- Type-safe, component-based email design

### `/__tests__` - Testing Suite
- **unit/**: Pure function tests
- **integration/**: API & database tests
- **e2e/**: End-to-end user flow tests

## 📋 Configuration Files

| File | Purpose |
|------|---------|
| `next.config.js` | Next.js framework configuration |
| `tailwind.config.ts` | Tailwind CSS theme customization |
| `tsconfig.json` | TypeScript compiler options |
| `.eslintrc.json` | Code linting rules |
| `vitest.config.ts` | Unit test configuration |
| `playwright.config.ts` | E2E test configuration |
| `middleware.ts` | Route protection & authentication |

## 🚀 Next Steps

1. **Install dependencies**: `npm install`
2. **Set up environment**: Copy `.env.example` to `.env`
3. **Database setup**: `npx prisma migrate dev`
4. **Seed data**: `npx prisma db seed`
5. **Start development**: `npm run dev`

## 📝 Notes

- TypeScript errors shown are expected before running `npm install`
- All configuration files are production-ready
- Project follows Next.js 14 best practices
- Authentication uses NextAuth v5 (stable)
- Database migrations will be created on first run
