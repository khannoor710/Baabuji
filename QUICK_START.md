# 🚀 Baabuji - Quick Start Guide

## Prerequisites Checklist

Before you begin, ensure you have:

- [x] Node.js 18.x or higher installed
- [x] PostgreSQL database (local or cloud)
- [ ] Stripe account (free test mode)
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## ⚡ Fast Setup (5 minutes)

### Step 1: Install Dependencies

```powershell
cd c:\Personal\Baabuji
npm install
```

**What this does**: Installs all required packages (Next.js, Prisma, Stripe, etc.)

### Step 2: Environment Configuration

```powershell
# Copy the example environment file
copy .env.example .env
```

**Edit `.env` file** with your credentials:

```env
# Minimum required for local development:
DATABASE_URL=postgresql://postgres:password@localhost:5432/baabuji
NEXTAUTH_SECRET=run-this-command-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000
```

> **Generate NEXTAUTH_SECRET**: Run `openssl rand -base64 32` in terminal

### Step 3: Database Setup

```powershell
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# Populate sample data (admin user + products)
npx prisma db seed
```

**What you get**:
- Admin account: `admin@baabuji.com` / `admin123`
- Customer account: `customer@example.com` / `customer123`
- 6 sample products with images

### Step 4: Start Development Server

```powershell
npm run dev
```

**Open**: [http://localhost:3000](http://localhost:3000)

---

## 🎯 Quick Actions

### Browse Products
1. Click "Shop Now" on homepage
2. Filter by category, fabric, price
3. View product details

### Test Checkout
1. Add products to cart
2. Go to checkout
3. Use test card: `4242 4242 4242 4242`

### Access Admin Panel
1. Login as admin: `admin@baabuji.com` / `admin123`
2. Visit: [http://localhost:3000/admin](http://localhost:3000/admin)
3. Manage products and orders

### View Database
```powershell
npx prisma studio
```
Opens visual database browser at [http://localhost:5555](http://localhost:5555)

---

## 🔧 Optional Setup

### Stripe Integration (for payments)

1. Create account at [stripe.com](https://stripe.com)
2. Get test API keys from Dashboard
3. Add to `.env`:

```env
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_key_here
```

### Email Service (for notifications)

1. Create account at [resend.com](https://resend.com)
2. Get API key
3. Add to `.env`:

```env
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=orders@yourdomain.com
```

### Image Hosting (for production)

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get cloud name and API credentials
3. Add to `.env`:

```env
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## 📚 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Check code quality |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npx prisma studio` | Open database browser |
| `npx prisma migrate dev` | Create new migration |
| `npx prisma db seed` | Re-seed database |

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@prisma/client'"

**Solution**:
```powershell
npx prisma generate
```

### Error: "Database connection failed"

**Solutions**:
1. Check PostgreSQL is running
2. Verify `DATABASE_URL` in `.env`
3. Test connection:
```powershell
npx prisma db push
```

### Error: "Port 3000 already in use"

**Solutions**:
1. Kill the process:
```powershell
# Find process using port 3000
netstat -ano | findstr :3000
# Kill it (replace PID)
taskkill /PID <PID> /F
```
2. Or use different port:
```powershell
PORT=3001 npm run dev
```

### TypeScript Errors in Editor

**Solution**: These are expected before `npm install`. After installation:
1. Close and reopen VS Code
2. Or reload window: `Ctrl+Shift+P` → "Reload Window"

---

## 🎓 Learning Resources

### Next.js Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)

### Prisma ORM
- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

### NextAuth.js
- [NextAuth Docs](https://next-auth.js.org)
- [Credentials Provider](https://next-auth.js.org/providers/credentials)

### Stripe Payments
- [Stripe Docs](https://stripe.com/docs)
- [Test Cards](https://stripe.com/docs/testing)

---

## 🚢 Deployment Guide

### Vercel (Recommended)

1. Push code to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy!

**Database**: Use Neon (free tier) for PostgreSQL
**Domain**: Get free `.vercel.app` subdomain

### Production Checklist

- [ ] Update `NEXTAUTH_URL` to production URL
- [ ] Use production Stripe keys
- [ ] Set up Cloudinary for images
- [ ] Configure email service
- [ ] Run `npx prisma migrate deploy` on production DB
- [ ] Set up Stripe webhooks

---

## 💡 Tips

1. **Hot Reload**: Changes auto-refresh in dev mode
2. **Database Changes**: Always create migrations (`npx prisma migrate dev`)
3. **Environment Variables**: Restart server after `.env` changes
4. **Testing**: Use separate test database
5. **Git**: Don't commit `.env` file (already in `.gitignore`)

---

## 📞 Need Help?

- Check `README.md` for detailed documentation
- Review `PROJECT_STRUCTURE.md` for file organization
- Read `.github/copilot-instructions.md` for project guidelines

---

**Happy Coding! 🎉**
