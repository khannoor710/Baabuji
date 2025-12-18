import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

/**
 * Stripe client instance
 * Configured for API version 2024-04-10
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
  typescript: true,
});

/**
 * Create a Stripe checkout session for order payment
 * @param orderId - The order ID from database
 * @param orderNumber - The user-facing order number
 * @param total - Total amount in paise
 * @param customerEmail - Customer's email address
 * @param items - Order items for line items display
 */
export async function createCheckoutSession({
  orderId,
  orderNumber,
  total,
  customerEmail,
  items,
}: {
  orderId: string;
  orderNumber: string;
  total: number;
  customerEmail: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map((item) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : undefined,
        },
        unit_amount: item.price, // Already in paise
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-confirmation/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?cancelled=true`,
    customer_email: customerEmail,
    metadata: {
      orderId,
      orderNumber,
    },
    payment_intent_data: {
      metadata: {
        orderId,
        orderNumber,
      },
    },
  });

  return session;
}

/**
 * Verify Stripe webhook signature
 * @param payload - Raw request body
 * @param signature - Stripe signature header
 */
export function constructWebhookEvent(payload: string | Buffer, signature: string) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
  }

  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
}
