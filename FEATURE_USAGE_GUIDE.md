# Feature Usage Guide - Baabuji E-commerce

Quick reference for developers on how to use the newly implemented features.

---

## 🔒 Stripe Payment Integration

### **Creating a Checkout Session (Online Payments)**

```typescript
// Frontend: app/checkout/page.tsx
const handleCheckout = async () => {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: cartItems,
      shippingAddress: {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+91 9876543210',
        addressLine1: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India'
      },
      paymentMethod: 'card', // or 'upi', 'netbanking'
      subtotal: 249900,  // In paise
      shipping: 5000,
      tax: 12495,
      total: 267395
    })
  });

  const { sessionUrl } = await response.json();
  window.location.href = sessionUrl; // Redirect to Stripe
};
```

### **Creating COD Orders**

```typescript
// For Cash on Delivery, use the existing endpoint
const response = await fetch('/api/orders/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: cartItems,
    shippingAddress: {...},
    paymentMethod: 'cod',
    subtotal, shipping, tax, total
  })
});
```

### **Webhook Testing (Development)**

```bash
# Install Stripe CLI
stripe login

# Forward webhooks to local server
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed
```

---

## 📧 Email Notifications

### **Sending Order Confirmation Email**

```typescript
import { sendOrderConfirmation } from '@/lib/email';

// Example usage
await sendOrderConfirmation({
  orderNumber: 'BAB-20251216-12345',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  orderDate: new Date(),
  items: [
    {
      name: 'Cotton Solid Men Unstitched',
      quantity: 2,
      price: 249900, // In paise
      image: 'https://cloudinary.com/image.jpg'
    }
  ],
  subtotal: 499800,
  shipping: 5000,
  tax: 24990,
  total: 529790,
  shippingAddress: {
    fullName: 'John Doe',
    addressLine1: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    country: 'India'
  }
});
```

### **Sending Welcome Email**

```typescript
import { sendWelcomeEmail } from '@/lib/email';

// After user registration
await sendWelcomeEmail('john@example.com', 'John Doe');
```

### **Sending Shipping Notification**

```typescript
import { sendOrderShipped } from '@/lib/email';

// When admin marks order as shipped
await sendOrderShipped({
  orderNumber: 'BAB-20251216-12345',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  orderDate: new Date(),
  items: [...],
  trackingNumber: 'TRK123456789',
  estimatedDelivery: new Date('2025-12-20'),
  // ... other fields
});
```

### **Sending Newsletter**

```typescript
import { sendNewsletterBatch } from '@/lib/email';

const subscribers = await prisma.newsletterSubscriber.findMany({
  where: { isActive: true },
  select: { email: true, unsubscribeToken: true }
});

await sendNewsletterBatch(
  subscribers,
  'New Arrivals: Premium Silk Collection',
  '<h1>Check out our new silk fabrics!</h1><p>...</p>'
);
```

---

## 🖼️ Image Upload (Admin)

### **Upload Image via API**

```typescript
// Frontend: Admin product form
const handleImageUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'products'); // Optional

  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    body: formData
  });

  const { url, publicId } = await response.json();
  
  // Save URL to product
  return { url, publicId };
};
```

### **Generate Thumbnails**

```typescript
import { generateThumbnail } from '@/lib/cloudinary';

const originalUrl = 'https://res.cloudinary.com/.../image.jpg';
const thumbnail = generateThumbnail(originalUrl, 300, 300);
// Returns: https://res.cloudinary.com/.../w_300,h_300,c_fill,q_auto/image.jpg
```

### **Delete Image**

```typescript
import { deleteImage } from '@/lib/cloudinary';

await deleteImage('baabuji/products/abc123');
```

---

## 📬 Contact Form

### **Submit Contact Message**

```typescript
// Frontend: app/contact/page.tsx
const handleSubmit = async (data: ContactFormData) => {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message
    })
  });

  if (response.ok) {
    toast.success('Message sent successfully!');
  }
};
```

### **View Contact Messages (Admin)**

```typescript
// Admin dashboard
const messages = await prisma.contactMessage.findMany({
  orderBy: { createdAt: 'desc' },
  take: 50
});
```

---

## 📰 Newsletter

### **Subscribe to Newsletter**

```typescript
// Frontend: Footer component
const handleSubscribe = async (email: string) => {
  const response = await fetch('/api/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name: 'Optional Name' })
  });

  const data = await response.json();
  toast.success(data.message);
};
```

### **Unsubscribe Link**

```html
<!-- In email template -->
<a href="https://baabuji.com/api/newsletter?token={unsubscribeToken}">
  Unsubscribe
</a>
```

### **Send Newsletter to All Subscribers**

```typescript
import { sendNewsletterBatch } from '@/lib/email';

// Admin sends newsletter
const subscribers = await prisma.newsletterSubscriber.findMany({
  where: { isActive: true }
});

const result = await sendNewsletterBatch(
  subscribers,
  'Subject Line',
  '<div>HTML content</div>'
);

console.log(`Sent to ${result.successful} subscribers`);
```

---

## 🎨 UI Components

### **Badge Component**

```tsx
import { Badge, OrderStatusBadge, PaymentStatusBadge } from '@/components/ui/badge';

// Generic badge
<Badge variant="success">Active</Badge>
<Badge variant="danger">Out of Stock</Badge>
<Badge variant="warning">Low Stock</Badge>

// Order status badge (auto-styled)
<OrderStatusBadge status="PENDING" />
<OrderStatusBadge status="SHIPPED" />
<OrderStatusBadge status="DELIVERED" />

// Payment status badge
<PaymentStatusBadge status="PAID" />
<PaymentStatusBadge status="PENDING" />
<PaymentStatusBadge status="FAILED" />
```

### **Skeleton Loaders**

```tsx
import { ProductCardSkeleton, ProductGridSkeleton, OrderItemSkeleton } from '@/components/ui/skeleton';

// Single product skeleton
<ProductCardSkeleton />

// Full grid skeleton
<ProductGridSkeleton count={8} />

// Order item skeleton
<OrderItemSkeleton />
```

### **Modal Component**

```tsx
import { Modal, ConfirmModal } from '@/components/ui/modal';
import { useState } from 'react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Generic modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Title"
        description="Optional description"
        size="md"
      >
        <p>Modal content here</p>
      </Modal>

      {/* Confirmation modal */}
      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product?"
        message="This action cannot be undone."
        variant="danger"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}
```

---

## 🔐 Security Best Practices

### **Verify Admin Access**

```typescript
// All admin routes should check authorization
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  // Admin-only logic here
}
```

### **Verify Webhook Signatures**

```typescript
import { constructWebhookEvent } from '@/lib/stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  
  // This throws error if signature invalid
  const event = constructWebhookEvent(body, signature);
  
  // Handle event
}
```

### **Validate Input Data**

```typescript
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100)
});

const data = schema.parse(body); // Throws if invalid
```

---

## 🔧 Utility Functions

### **Format Currency**

```typescript
import { formatPrice } from '@/lib/utils';

const price = 249900; // In paise
const formatted = formatPrice(price); // "₹2,499.00"
```

### **Generate Order Number**

```typescript
// Happens automatically in /api/orders/create and /api/checkout
// Format: BAB-YYYYMMDD-XXXXX
// Example: BAB-20251216-12345
```

---

## 📊 Database Queries

### **Get Orders with Payment Status**

```typescript
const orders = await prisma.order.findMany({
  where: {
    paymentStatus: 'PAID',
    status: { in: ['PENDING', 'SHIPPED'] }
  },
  include: {
    items: true
  },
  orderBy: { createdAt: 'desc' }
});
```

### **Get Newsletter Subscribers**

```typescript
const activeSubscribers = await prisma.newsletterSubscriber.findMany({
  where: { isActive: true },
  select: { email: true, unsubscribeToken: true }
});
```

### **Get Recent Contact Messages**

```typescript
const messages = await prisma.contactMessage.findMany({
  orderBy: { createdAt: 'desc' },
  take: 20
});
```

---

## 🧪 Testing with Test Data

### **Stripe Test Cards**

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Requires authentication: 4000 0025 0000 3155
Insufficient funds: 4000 0000 0000 9995
```

### **Test Email Addresses**

```
Resend accepts real emails in test mode.
Use: yourname+test@gmail.com for testing
```

### **Test Image Upload**

```bash
# Use any JPEG/PNG/WebP < 5MB
# Recommended: 1200x1200px product images
```

---

## 📝 Common Patterns

### **Non-Blocking Email Send**

```typescript
// Don't wait for email to complete
sendWelcomeEmail(email, name).catch(console.error);

// Continue with response
return NextResponse.json({ success: true });
```

### **Transaction Safety**

```typescript
// Always use transactions for multi-step operations
const result = await prisma.$transaction(async (tx) => {
  const order = await tx.order.create({...});
  
  for (const item of items) {
    await tx.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } }
    });
  }
  
  return order;
});
```

### **Error Handling Pattern**

```typescript
try {
  // Operation
} catch (error) {
  console.error('Descriptive error message:', error);
  
  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  
  return NextResponse.json({ error: 'Generic error message' }, { status: 500 });
}
```

---

## 🚀 Development Workflow

### **Start Development**

```bash
npm run dev               # Start Next.js dev server
npm run prisma:studio    # Open Prisma Studio (database GUI)
```

### **Test Features Locally**

```bash
# Terminal 1: Run dev server
npm run dev

# Terminal 2: Forward Stripe webhooks
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe

# Terminal 3: Monitor logs
# Check Vercel CLI or browser console
```

### **Before Deployment**

```bash
npm run type-check       # Check TypeScript
npm run lint             # Check ESLint
npm run build            # Test production build
```

---

## 📚 Additional Resources

- **Stripe Docs**: https://stripe.com/docs
- **Resend Docs**: https://resend.com/docs
- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs

---

**Last Updated:** December 16, 2025
**Version:** 1.0.0
