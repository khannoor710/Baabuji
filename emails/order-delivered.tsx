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

interface OrderDeliveredEmailProps {
  orderNumber: string;
  customerName: string;
}

export function OrderDeliveredEmail({ orderNumber, customerName }: OrderDeliveredEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your order {orderNumber} has been delivered!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headerTitle}>Baabuji</Heading>
            <Text style={headerSubtitle}>Premium Unstitched Clothing</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>Your order has been delivered! ✨</Heading>
            <Text style={text}>Hi {customerName},</Text>
            <Text style={text}>
              Your order <strong>{orderNumber}</strong> has been successfully delivered. We hope you love your new premium fabrics!
            </Text>

            <Text style={text}>
              We'd love to hear about your experience. Please consider leaving a review to help other customers.
            </Text>

            <Section style={buttonContainer}>
              <Link style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/account/orders`}>
                View Order Details
              </Link>
            </Section>

            <Text style={footer}>
              Thank you for shopping with Baabuji! If you have any concerns about your order, please contact us at{' '}
              <Link href="mailto:support@baabuji.com">support@baabuji.com</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default OrderDeliveredEmail;

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
