import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { constructWebhookEvent } from '@/lib/stripe';
import { PaymentStatus, OrderStatus } from '@prisma/client';
import { sendOrderConfirmation } from '@/lib/email';
import { logger } from '@/lib/logger';

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events
 * 
 * Required webhook events in Stripe Dashboard:
 * - checkout.session.completed
 * - payment_intent.succeeded
 * - payment_intent.payment_failed
 */
export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const event = constructWebhookEvent(body, signature);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        
        // Extract order ID from metadata
        const orderId = session.metadata?.orderId;
        
        if (!orderId) {
          logger.error('No orderId in session metadata', undefined, { sessionId: session.id });
          return NextResponse.json({ received: true });
        }

        // Update order payment status
        const order = await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: PaymentStatus.PAID,
            stripePaymentIntentId: session.payment_intent,
          },
          include: {
            items: true,
          },
        });

        // Send order confirmation email
        await sendOrderConfirmation({
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          orderDate: order.createdAt,
          items: order.items.map((item) => ({
            name: item.productName,
            quantity: item.quantity,
            price: item.price,
            image: item.productImage || undefined,
          })),
          subtotal: order.subtotal,
          shipping: order.shippingCost,
          tax: order.tax,
          total: order.total,
          shippingAddress: {
            fullName: order.customerName,
            addressLine1: order.shippingAddressLine1,
            addressLine2: order.shippingAddressLine2 || undefined,
            city: order.shippingCity,
            state: order.shippingState,
            postalCode: order.shippingPostalCode,
            country: order.shippingCountry,
          },
        });

        logger.payment('Payment completed', order.id, { orderNumber: order.orderNumber });
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: PaymentStatus.PAID,
              stripePaymentIntentId: paymentIntent.id,
            },
          });

          logger.payment('Payment intent succeeded', orderId, { orderId });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          const order = await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: PaymentStatus.FAILED,
            },
            include: {
              items: true,
            },
          });

          // Restore stock since payment failed
          for (const item of order.items) {
            await prisma.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  increment: item.quantity,
                },
              },
            });
          }

          logger.payment('Payment failed - stock restored', order.id, { orderNumber: order.orderNumber });
        }
        break;
      }

      default:
        logger.warn('Unhandled webhook event type', { eventType: event.type });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('Webhook handler failed', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

// Disable body parsing to get raw body for signature verification
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
