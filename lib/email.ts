import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/emails/order-confirmation';
import { OrderShippedEmail } from '@/emails/order-shipped';
import { OrderDeliveredEmail } from '@/emails/order-delivered';
import { WelcomeEmail } from '@/emails/welcome';
import { NewsletterEmail } from '@/emails/newsletter';

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is not defined. Email functionality will be disabled.');
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.EMAIL_FROM || 'orders@baabuji.com';

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  orderDate: Date;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: Date;
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(data: OrderEmailData) {
  if (!resend) {
    console.warn('Resend not configured. Skipping order confirmation email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Order Confirmation - ${data.orderNumber}`,
      react: OrderConfirmationEmail(data),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return { success: false, error };
  }
}

/**
 * Send order shipped notification
 */
export async function sendOrderShipped(data: OrderEmailData) {
  if (!resend) {
    console.warn('Resend not configured. Skipping order shipped email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Your Order Has Been Shipped - ${data.orderNumber}`,
      react: OrderShippedEmail(data),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send order shipped email:', error);
    return { success: false, error };
  }
}

/**
 * Send order delivered notification
 */
export async function sendOrderDelivered(data: OrderEmailData) {
  if (!resend) {
    console.warn('Resend not configured. Skipping order delivered email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Your Order Has Been Delivered - ${data.orderNumber}`,
      react: OrderDeliveredEmail(data),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send order delivered email:', error);
    return { success: false, error };
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(email: string, name: string) {
  if (!resend) {
    console.warn('Resend not configured. Skipping welcome email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to Baabuji - Premium Unstitched Clothing',
      react: WelcomeEmail({ name, email }),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error };
  }
}

/**
 * Send newsletter email
 */
export async function sendNewsletterEmail(
  email: string,
  subject: string,
  content: string,
  unsubscribeToken: string
) {
  if (!resend) {
    console.warn('Resend not configured. Skipping newsletter email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      react: NewsletterEmail({ content, unsubscribeToken }),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send newsletter email:', error);
    return { success: false, error };
  }
}

/**
 * Send batch newsletter to multiple subscribers
 */
export async function sendNewsletterBatch(
  subscribers: Array<{ email: string; unsubscribeToken: string }>,
  subject: string,
  content: string
) {
  if (!resend) {
    console.warn('Resend not configured. Skipping newsletter batch.');
    return { success: false, error: 'Email service not configured' };
  }

  const results = await Promise.allSettled(
    subscribers.map((subscriber) =>
      sendNewsletterEmail(subscriber.email, subject, content, subscriber.unsubscribeToken)
    )
  );

  const successful = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  return {
    success: true,
    total: subscribers.length,
    successful,
    failed,
  };
}
