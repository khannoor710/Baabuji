---
mode: agent
---
You are an expert full-stack web developer.  
Build a **complete, production-ready e-commerce website** for an **unstitched clothing brand** named **“Baabuji”**.

========================================
1. TECH STACK & PROJECT SETUP
========================================
Use the following stack and structure:

- Framework: **Next.js** (latest stable, app router)
- Language: **TypeScript**
- Styling: **Tailwind CSS**
- Forms: React Hook Form (or similar)
- State management: Built-in React/Next patterns (no Redux unless really necessary)
- Database: **PostgreSQL** with **Prisma ORM**
- Auth: **NextAuth.js** with credentials provider (email + password) and room for OAuth later
- Payments: **Stripe** integration (test mode), with good separation so API keys are loaded from environment variables
- Images: Next.js `<Image />` where possible
- API: Use **Next.js API routes** or app router handlers for server-side functions

Create:
- A proper folder structure under `/app`, `/components`, `/lib`, `/prisma`.
- A `README.md` explaining setup, environment variables, and how to run the project.
- Tailwind configuration tuned for the brand (colors & fonts).

========================================
2. BRANDING & DESIGN GUIDELINES
========================================
Brand: **Baabuji** – Unstitched Clothing Brand

Target: people who love traditional South Asian / ethnic wear and premium unstitched fabrics.

Brand feel:
- Elegant, minimal, premium.
- Colors: 
  - Primary: Deep earthy brown or maroon (for richness)
  - Secondary: Warm beige/cream (for background)
  - Accent: Muted gold or mustard (for CTA highlights)
- Fonts:
  - Headings: Serif or classy display font
  - Body: Clean sans-serif
- Overall: Lots of white/negative space, big product photos, clear typography.

Include:
- A simple **logo placeholder** with the text “Baabuji”.
- Reusable layout: a top navigation bar, footer, and consistent page layout container.

========================================
3. CORE PAGES & ROUTES
========================================
Implement the following main pages/routes:

1. **Home Page** (`/`)
   - Hero section:
     - Brand name “Baabuji”
     - Tagline like: “Premium Unstitched Fabrics for Every Occasion”
     - CTA buttons: “Shop Men”, “Shop Women”, “View All Fabrics”
   - Featured sections:
     - “New Arrivals”
     - “Festive Collection”
     - “Best Sellers”
   - Short brand story section (“About Baabuji”).
   - Highlight benefits:
     - Free shipping over a threshold (configurable)
     - Easy returns policy (placeholder copy)
     - Cash on Delivery availability (optional text)
   - Newsletter signup form (email capture only, store in DB table `NewsletterSubscriber`).

2. **Shop / Catalog Page** (`/shop`)
   - Grid of products with:
     - Product image
     - Name
     - Short description snippet
     - Price
     - “View Details” button
   - Filters:
     - Category: Men, Women, Kids
     - Fabric Type: Cotton, Linen, Silk, Blends, etc.
     - Pattern: Solid, Printed, Embroidered, Striped, Checks
     - Color (basic color tags like White, Black, Blue, Red, etc.)
     - Price Range slider (min/max)
     - Availability (In stock only)
   - Sorting:
     - Newest
     - Price: Low to High
     - Price: High to Low
     - Featured
   - Pagination or infinite scroll.

3. **Product Detail Page** (`/product/[slug]`)
   - Display:
     - Product name
     - High-quality image gallery (multiple images, zoom/hover where possible)
     - Price (with optional discount display)
     - Short description and detailed description
     - Fabric composition (e.g., 100% cotton), GSM if needed
     - Pattern, color(s), length (meters) and width information
     - Stock availability
     - SKU / Product code
   - Selection:
     - Quantity selector (based on number of units or meters)
   - Actions:
     - “Add to Cart”
     - “Buy Now” (direct to checkout with this item)
   - Additional:
     - “You may also like” / related products section.
     - Customer reviews section (placeholder, but with DB model and components ready).

4. **Cart Page** (`/cart`)
   - List all items:
     - Product image
     - Name
     - Selected quantity
     - Per-unit price
     - Line total
   - Features:
     - Ability to update quantity
     - Remove item from cart
     - Clear cart
     - Display subtotal, estimated shipping, and total
     - Button to “Proceed to Checkout”
   - Cart state should persist (e.g., using cookies/local storage + server sync where needed).

5. **Checkout Page** (`/checkout`)
   - If user is logged in, prefill saved addresses.
   - If guest checkout allowed, provide forms.
   - Steps:
     1. Shipping Address
     2. Billing Address (or checkbox: same as shipping)
     3. Order summary review
     4. Payment (Stripe test/card data)
   - Implement server-side order creation and redirect to Stripe checkout/session.
   - On success, redirect to **Order Confirmation** page.

6. **Order Confirmation Page** (`/order/[id]` or `/order/success`)
   - Show:
     - Order ID
     - Summary of products
     - Total amount paid
     - Shipping details
     - Estimated delivery date (simple calculated placeholder)
   - Clear cart on successful order.

7. **User Account Pages**
   - **Login** (`/auth/login`)
   - **Register** (`/auth/register`)
   - **Profile / My Account** (`/account`)
     - View/update profile (name, phone, etc.)
     - Manage addresses (add/edit/delete addresses)
     - View order history, view order detail pages
   - Protect these routes using NextAuth and middleware.

8. **Admin Dashboard** (`/admin`)
   Admin-only pages, protected with role-based access control:
   - **Admin Login** (same auth system but role=admin)
   - **Products Management**
     - List products with search, filter by category
     - Create new product
     - Edit existing product
     - Upload image URLs / image paths
   - **Orders Management**
     - List all orders
     - Filter by status: Pending, Paid, Shipped, Delivered, Cancelled
     - View order details
     - Ability to update order status
   - Basic metrics:
     - Total orders
     - Total revenue (simple sum)
     - Recent orders list

9. **Informational Pages**
   - **About** (`/about`) with Baabuji story and visuals.
   - **Contact** (`/contact`): form (name, email, message) to store messages in DB.
   - **FAQ** (`/faq`) for shipping, returns, fabric care.
   - **Terms & Conditions**, **Privacy Policy**, **Returns & Refunds** pages.

========================================
4. DATA MODELS (PRISMA SCHEMA)
========================================
Create Prisma models for at least:

1. **User**
   - id (string/uuid)
   - name
   - email (unique)
   - passwordHash (for credentials auth)
   - role: enum [CUSTOMER, ADMIN]
   - createdAt, updatedAt
   - relations: addresses, orders

2. **Address**
   - id
   - userId
   - fullName
   - phone
   - line1, line2
   - city
   - state
   - postalCode
   - country
   - isDefaultShipping
   - isDefaultBilling

3. **Product**
   - id
   - name
   - slug (unique)
   - category: enum [MEN, WOMEN, KIDS, UNISEX]
   - subCategory: e.g. “Suit Piece”, “Kurta Fabric”, “Saree Fabric”
   - descriptionShort
   - descriptionLong
   - price
   - discountedPrice (optional)
   - currency (e.g., “INR”)
   - inStockQuantity
   - fabricType (e.g., Cotton, Silk)
   - fabricComposition (string)
   - pattern (Solid, Printed, etc.)
   - primaryColor
   - otherColors (string array or JSON)
   - lengthInMeters
   - widthInMeters
   - isFeatured (boolean)
   - tags (string array or JSON)
   - images (related model or JSON)

4. **ProductImage**
   - id
   - productId
   - url
   - altText
   - isPrimary

5. **Order**
   - id
   - userId (nullable for guest orders if supported)
   - status: enum [PENDING, PAID, SHIPPED, DELIVERED, CANCELLED]
   - paymentStatus: enum [PENDING, PAID, FAILED, REFUNDED]
   - subtotal
   - shippingFee
   - total
   - currency
   - shippingAddress (can reference Address or store snapshot JSON)
   - billingAddress (same as above)
   - stripeSessionId / paymentReference
   - createdAt, updatedAt

6. **OrderItem**
   - id
   - orderId
   - productId
   - productNameSnapshot
   - unitPrice
   - quantity
   - lineTotal

7. **Review** (optional but prepare the model)
   - id
   - productId
   - userId
   - rating (1–5)
   - title
   - comment
   - createdAt

8. **NewsletterSubscriber**
   - id
   - email
   - createdAt

9. **ContactMessage**
   - id
   - name
   - email
   - message
   - createdAt

Set up Prisma migrations and seed script with sample products for Baabuji.

========================================
5. CART & ORDER FLOW
========================================
Implement a clean cart and checkout flow:

- Cart stored client-side and synced with server when logged in.
- APIs:
  - `POST /api/cart` for updating cart items (if using server side)
  - `POST /api/checkout` to create order + Stripe checkout session
  - `GET /api/products`, `GET /api/products/[slug]`, `GET /api/orders/[id]`, etc.
- When checkout succeeds:
  - Mark order as PAID
  - Store Stripe payment details
  - Redirect to order confirmation page
- Include proper error handling and toast notifications for:
  - Network errors
  - Out-of-stock situations (check stock at checkout)
  - Payment errors

========================================
6. AUTHENTICATION & AUTHORIZATION
========================================
- Use NextAuth with:
  - Credentials provider (email + password)
- Register flow:
  - Validate email format and password strength
  - Hash password with bcrypt
- Login flow:
  - Validate credentials against DB
- Authorization:
  - Middleware to protect `/account` and `/admin`.
  - Users with `role = ADMIN` can access `/admin` routes.

========================================
7. UI COMPONENTS & UX DETAILS
========================================
Create reusable components:

- Layout:
  - `MainLayout` with header, footer, and main content.
- Header/NavBar:
  - Logo (“Baabuji” text)
  - Links: Home, Shop, Men, Women, Kids, About, Contact
  - Search bar to search products by name/tag
  - Icons: Cart (with item count), User (login/account)
- Footer:
  - Links to FAQ, Terms, Privacy, Returns
  - Social media icons (placeholders)
  - Newsletter signup field

- Components:
  - ProductCard
  - ProductGrid
  - FilterSidebar
  - SortDropdown
  - CartItem
  - OrderSummary
  - Button, Input, Select, Modal, Toast

UX requirements:
- Mobile-first responsive design.
- Accessible components:
  - Proper alt text for images
  - ARIA labels for important widgets
  - Good color contrast
- Loading and empty states for pages:
  - e.g., “No products found” messages
  - Skeleton loaders while fetching data

========================================
8. SEO & PERFORMANCE
========================================
- Use Next.js metadata for:
  - Dynamic titles and descriptions (per page & per product)
  - Open Graph tags for product pages
- Sitemap and robots.txt
- Use image optimization and lazy loading where possible.
- Pre-fetch main routes for snappy navigation.

========================================
9. CONFIGURATION & DOCUMENTATION
========================================
- Use environment variables for:
  - DATABASE_URL
  - NEXTAUTH_SECRET
  - NEXTAUTH_URL
  - STRIPE_SECRET_KEY
  - STRIPE_PUBLIC_KEY
  - STRIPE_WEBHOOK_SECRET (if implementing webhooks)
- Add a **README.md** that includes:
  - Project overview
  - Tech stack
  - Setup instructions (install, env vars, migrations, seeding, running dev & build)
  - How to run tests (if you add tests)
- If possible, include a simple test or two (e.g., for some utility function or a key component).

========================================
10. OUTPUT EXPECTATIONS
========================================
Please:
1. Generate the **Next.js project structure** and key files.
2. Implement all pages, components, models, and API routes described above.
3. Ensure the website is **fully functional locally** with:
   - User registration and login
   - Browsing and filtering products
   - Viewing product details
   - Adding to cart
   - Checkout with Stripe test mode
   - Admin product and order management
4. Keep the code clean, well-typed with TypeScript, and well-commented where helpful.

Brand name to use throughout: **Baabuji**  
Tagline example: **“Premium Unstitched Fabrics, Tailored by You.”**

Start by scaffolding the Next.js app and Prisma schema, then gradually implement all features as described.
