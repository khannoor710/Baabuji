import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createCheckoutSession } from '@/lib/stripe';
import { OrderStatus, PaymentStatus } from '@prisma/client';

interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
}

interface CheckoutRequest {
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: 'card' | 'upi' | 'cod' | 'netbanking';
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

async function generateOrderNumber(): Promise<string> {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(10000 + Math.random() * 90000);
  const orderNumber = `BAB-${dateStr}-${random}`;
  
  const existing = await prisma.order.findUnique({
    where: { orderNumber },
  });
  
  if (existing) {
    return generateOrderNumber();
  }
  
  return orderNumber;
}

/**
 * POST /api/checkout
 * Create a Stripe checkout session for online payment methods (CARD, UPI, NETBANKING)
 * For COD orders, use /api/orders/create directly
 */
export async function POST(request: Request) {
  try {
    const body: CheckoutRequest = await request.json();
    const { items, shippingAddress, paymentMethod, subtotal, shipping, tax, total } = body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.email) {
      return NextResponse.json({ error: 'Invalid shipping address' }, { status: 400 });
    }

    // COD orders should use /api/orders/create instead
    if (paymentMethod === 'cod') {
      return NextResponse.json(
        { error: 'COD orders should use /api/orders/create endpoint' },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = await generateOrderNumber();

    // Create order in PENDING state (will be updated via webhook)
    const order = await prisma.$transaction(async (tx) => {
      // Validate stock availability
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { id: true, stock: true, price: true, isActive: true },
        });

        if (!product || !product.isActive) {
          throw new Error(`Product ${item.name} is no longer available`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name}. Only ${product.stock} available`);
        }

        if (product.price !== item.price) {
          throw new Error(`Price has changed for ${item.name}. Please refresh and try again`);
        }
      }

      // Create order with PENDING payment status
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerEmail: shippingAddress.email,
          customerName: shippingAddress.fullName,
          customerPhone: shippingAddress.phone,
          
          shippingAddressLine1: shippingAddress.addressLine1,
          shippingAddressLine2: shippingAddress.addressLine2 || null,
          shippingCity: shippingAddress.city,
          shippingState: shippingAddress.state,
          shippingPostalCode: shippingAddress.postalCode,
          shippingCountry: shippingAddress.country,

          billingAddressLine1: shippingAddress.addressLine1,
          billingAddressLine2: shippingAddress.addressLine2 || null,
          billingCity: shippingAddress.city,
          billingState: shippingAddress.state,
          billingPostalCode: shippingAddress.postalCode,
          billingCountry: shippingAddress.country,

          subtotal,
          shippingCost: shipping,
          tax,
          total,

          paymentMethod: paymentMethod.toUpperCase(),
          paymentStatus: PaymentStatus.PENDING, // Will be updated by webhook
          status: OrderStatus.PENDING,

          items: {
            create: items.map((item) => ({
              productId: item.productId,
              productName: item.name,
              productSlug: item.slug,
              productImage: item.image,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Reserve stock (deduct immediately to prevent overselling)
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      customerEmail: shippingAddress.email,
      items: items.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
    });

    // Update order with Stripe session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({
      sessionId: session.id,
      sessionUrl: session.url,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
