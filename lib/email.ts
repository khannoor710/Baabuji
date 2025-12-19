import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/emails/order-confirmation';
import { OrderShippedEmail } from '@/emails/order-shipped';
import { OrderDeliveredEmail } from '@/emails/order-delivered';
import { WelcomeEmail } from '@/emails/welcome';
import { NewsletterEmail } from '@/emails/newsletter';
import { logger } from '@/lib/logger';

if (!process.env.RESEND_API_KEY) {
  logger.warn('RESEND_API_KEY is not defined. Email functionality will be disabled.');
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
    logger.warn('Resend not configured. Skipping order confirmation email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Order Confirmation - ${data.orderNumber}`,
      react: OrderConfirmationEmail(data),
    });

    logger.email('Order confirmation sent', data.customerEmail, { orderNumber: data.orderNumber });
    return { success: true, data: result };
  } catch (error) {
    logger.error('Failed to send order confirmation email', error, { orderNumber: data.orderNumber });
    return { success: false, error };
  }
}

/**
 * Send order shipped notification
 */
export async function sendOrderShipped(data: OrderEmailData) {
  if (!resend) {
    logger.warn('Resend not configured. Skipping order shipped email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Your Order Has Been Shipped - ${data.orderNumber}`,
      react: OrderShippedEmail(data),
    });

    logger.email('Order shipped notification sent', data.customerEmail, { orderNumber: data.orderNumber });
    return { success: true, data: result };
  } catch (error) {
    logger.error('Failed to send order shipped email', error, { orderNumber: data.orderNumber });
    return { success: false, error };
  }
}

/**
 * Send order delivered notification
 */
export async function sendOrderDelivered(data: OrderEmailData) {
  if (!resend) {
    logger.warn('Resend not configured. Skipping order delivered email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Your Order Has Been Delivered - ${data.orderNumber}`,
      react: OrderDeliveredEmail(data),
    });

    logger.email('Order delivered notification sent', data.customerEmail, { orderNumber: data.orderNumber });
    return { success: true, data: result };
  } catch (error) {
    logger.error('Failed to send order delivered email', error, { orderNumber: data.orderNumber });
    return { success: false, error };
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(email: string, name: string) {
  if (!resend) {
    logger.warn('Resend not configured. Skipping welcome email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to Baabuji - Premium Unstitched Clothing',
      react: WelcomeEmail({ name, email }),
    });

    logger.email('Welcome email sent', email, { name });
    return { success: true, data: result };
  } catch (error) {
    logger.error('Failed to send welcome email', error, { email });
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
    logger.warn('Resend not configured. Skipping newsletter email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      react: NewsletterEmail({ content, unsubscribeToken }),
    });

    logger.email('Newsletter sent', email, { subject });
    return { success: true, data: result };
  } catch (error) {
    logger.error('Failed to send newsletter email', error, { email, subject });
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
    logger.warn('Resend not configured. Skipping newsletter batch.');
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

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, name: string, resetLink: string) {
  if (!resend) {
    logger.warn('Resend not configured. Skipping password reset email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { PasswordResetEmail } = await import('@/emails/password-reset');
    
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Reset Your Password - Baabuji',
      react: PasswordResetEmail({ name, resetLink }),
    });

    logger.email('Password reset email sent', email);
    return { success: true, data: result };
  } catch (error) {
    logger.error('Failed to send password reset email', error, { email });
    return { success: false, error };
  }
}

/**
 * Send admin notification for new order
 */
export async function sendAdminOrderNotification(orderData: OrderEmailData) {
  if (!resend) {
    logger.warn('Resend not configured. Skipping admin order notification.');
    return { success: false, error: 'Email service not configured' };
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@baabuji.com';

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmail,
      subject: `New Order Received - ${orderData.orderNumber}`,
      react: OrderConfirmationEmail(orderData),
    });

    logger.email('Admin order notification sent', adminEmail, { orderNumber: orderData.orderNumber });
    return { success: true, data: result };
  } catch (error) {
    logger.error('Failed to send admin order notification', error, { orderNumber: orderData.orderNumber });
    return { success: false, error };
  }
}

/**
 * Send admin notification for contact form submission
 */
export async function sendAdminContactNotification(contactData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (!resend) {
    logger.warn('Resend not configured. Skipping admin contact notification.');
    return { success: false, error: 'Email service not configured' };
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@baabuji.com';

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmail,
      subject: `New Contact Form Submission: ${contactData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${contactData.name} (${contactData.email})</p>
        <p><strong>Subject:</strong> ${contactData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${contactData.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p style="font-size: 12px; color: #666;">
          Reply directly to this email to respond to the customer.
        </p>
      `,
      reply_to: contactData.email,
    });

    logger.email('Admin contact notification sent', adminEmail, { from: contactData.email });
    return { success: true, data: result };
  } catch (error) {
    logger.error('Failed to send admin contact notification', error, { from: contactData.email });
    return { success: false, error };
  }
}
