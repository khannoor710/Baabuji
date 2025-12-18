import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface OrderShippedEmailProps {
  orderNumber: string;
  customerName: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
}

export function OrderShippedEmail({
  orderNumber,
  customerName,
  trackingNumber,
  estimatedDelivery,
}: OrderShippedEmailProps) {
  const formattedDelivery = estimatedDelivery
    ? new Date(estimatedDelivery).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'within 5-7 business days';

  return (
    <Html>
      <Head />
      <Preview>Your order {orderNumber} has been shipped!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headerTitle}>Baabuji</Heading>
            <Text style={headerSubtitle}>Premium Unstitched Clothing</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>Your order is on its way! 📦</Heading>
            <Text style={text}>Hi {customerName},</Text>
            <Text style={text}>
              Great news! Your order <strong>{orderNumber}</strong> has been shipped and is on its way to you.
            </Text>

            {trackingNumber && (
              <Section style={trackingBox}>
                <Text style={label}>Tracking Number</Text>
                <Text style={trackingText}>{trackingNumber}</Text>
              </Section>
            )}

            <Text style={text}>
              <strong>Estimated Delivery:</strong> {formattedDelivery}
            </Text>

            <Section style={buttonContainer}>
              <Link style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/account/orders`}>
                Track Your Order
              </Link>
            </Section>

            <Text style={footer}>
              If you have any questions, contact us at{' '}
              <Link href="mailto:support@baabuji.com">support@baabuji.com</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default OrderShippedEmail;

const main = {
  backgroundColor: '#f6f6f6',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#5c2e1f',
  padding: '30px 20px',
  textAlign: 'center' as const,
};

const headerTitle = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
};

const headerSubtitle = {
  color: '#e8dcc8',
  fontSize: '14px',
  margin: '5px 0 0 0',
};

const content = {
  padding: '30px 20px',
};

const h1 = {
  color: '#333333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 15px 0',
};

const text = {
  color: '#555555',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 10px 0',
};

const trackingBox = {
  backgroundColor: '#f9f9f9',
  borderRadius: '5px',
  padding: '15px',
  margin: '20px 0',
  textAlign: 'center' as const,
};

const label = {
  color: '#888888',
  fontSize: '12px',
  margin: '0 0 5px 0',
};

const trackingText = {
  color: '#5c2e1f',
  fontSize: '20px',
  fontWeight: 'bold',
  fontFamily: 'monospace',
  margin: '0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#5c2e1f',
  borderRadius: '5px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '12px 30px',
  textDecoration: 'none',
};

const footer = {
  color: '#888888',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '20px 0 0 0',
  textAlign: 'center' as const,
};
