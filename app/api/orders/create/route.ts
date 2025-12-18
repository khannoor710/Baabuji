import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { sendOrderConfirmation } from '@/lib/email';
import { logger } from '@/lib/logger';

interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
}

// Generate unique order number (format: BAB-YYYYMMDD-XXXXX)
async function generateOrderNumber(): Promise<string> {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(10000 + Math.random() * 90000);
  const orderNumber = `BAB-${dateStr}-${random}`;
  
  // Check if it already exists (very unlikely, but safe)
  const existing = await prisma.order.findUnique({
    where: { orderNumber },
  });
  
  if (existing) {
    return generateOrderNumber(); // Recursive call if collision
  }
  
  return orderNumber;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, shippingAddress, paymentMethod, subtotal, shipping, tax, total } = body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: 'Cart is empty' }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.email) {
      return NextResponse.json({ message: 'Invalid shipping address' }, { status: 400 });
    }

    if (!paymentMethod) {
      return NextResponse.json({ message: 'Payment method is required' }, { status: 400 });
    }

    // Generate order number
    const orderNumber = await generateOrderNumber();

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Validate stock availability for all items
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

        // Validate price hasn't changed (prevent manipulation)
        if (product.price !== item.price) {
          throw new Error(`Price has changed for ${item.name}. Please refresh and try again`);
        }
      }

      // 2. Create order
      const order = await tx.order.create({
        data: {
          orderNumber,
          
          // Guest customer info
          customerEmail: shippingAddress.email,
          customerName: shippingAddress.fullName,
          customerPhone: shippingAddress.phone,
          
          // Shipping address
          shippingAddressLine1: shippingAddress.addressLine1,
          shippingAddressLine2: shippingAddress.addressLine2 || null,
          shippingCity: shippingAddress.city,
          shippingState: shippingAddress.state,
          shippingPostalCode: shippingAddress.postalCode,
          shippingCountry: shippingAddress.country,

          // Billing address (same as shipping for now)
          billingAddressLine1: shippingAddress.addressLine1,
          billingAddressLine2: shippingAddress.addressLine2 || null,
          billingCity: shippingAddress.city,
          billingState: shippingAddress.state,
          billingPostalCode: shippingAddress.postalCode,
          billingCountry: shippingAddress.country,

          // Order totals
          subtotal,
          shippingCost: shipping,
          tax,
          total,

          // Payment - SECURITY FIX: Only COD is PENDING, all others should go through Stripe
          paymentMethod: paymentMethod.toUpperCase(),
          paymentStatus: PaymentStatus.PENDING, // All orders start as PENDING
          
          // Order status
          status: OrderStatus.PENDING,

          // Create order items
          items: {
            create: items.map((item: OrderItem) => ({
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

      // 3. Deduct stock for each product
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

      return order;
    });

    // Send order confirmation email for COD orders
    if (paymentMethod === 'cod') {
      await sendOrderConfirmation({
        orderNumber: result.orderNumber,
        customerName: result.customerName,
        customerEmail: result.customerEmail,
        orderDate: result.createdAt,
        items: result.items.map((item) => ({
          name: item.productName,
          quantity: item.quantity,
          price: item.price,
          image: item.productImage || undefined,
        })),
        subtotal: result.subtotal,
        shipping: result.shippingCost,
        tax: result.tax,
        total: result.total,
        shippingAddress: {
          fullName: result.customerName,
          addressLine1: result.shippingAddressLine1,
          addressLine2: result.shippingAddressLine2 || undefined,
          city: result.shippingCity,
          state: result.shippingState,
          postalCode: result.shippingPostalCode,
          country: result.shippingCountry,
        },
      });
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        orderId: result.id,
        orderNumber: result.orderNumber,
        message: 'Order created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error('Order creation failed', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'An error occurred while creating the order' },
      { status: 500 }
    );
  }
}