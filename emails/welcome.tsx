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

interface WelcomeEmailProps {
  name: string;
  email: string;
}

export function WelcomeEmail({ name, email }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Baabuji - Your journey to premium fabrics begins!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headerTitle}>Baabuji</Heading>
            <Text style={headerSubtitle}>Premium Unstitched Clothing</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>Welcome to Baabuji! 🎉</Heading>
            <Text style={text}>Hi {name},</Text>
            <Text style={text}>
              Thank you for joining Baabuji, your destination for premium unstitched clothing. We're excited to have you with us!
            </Text>

            <Text style={text}>
              Discover our curated collection of finest fabrics including cotton, silk, linen, and more. Each piece is carefully selected to bring you quality and elegance.
            </Text>

            <Heading style={h2}>Get Started</Heading>
            <ul style={list}>
              <li style={listItem}>Browse our extensive collection of premium fabrics</li>
              <li style={listItem}>Save your favorite items for later</li>
              <li style={listItem}>Track your orders in real-time</li>
              <li style={listItem}>Enjoy exclusive member benefits</li>
            </ul>

            <Section style={buttonContainer}>
              <Link style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/shop`}>
                Start Shopping
              </Link>
            </Section>

            <Text style={footer}>
              Need help? Contact us at{' '}
              <Link href="mailto:support@baabuji.com">support@baabuji.com</Link>
              <br />
              <br />
              You're receiving this email because you registered at Baabuji using {email}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomeEmail;

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

const h2 = {
  color: '#333333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '20px 0 10px 0',
};

const text = {
  color: '#555555',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 10px 0',
};

const list = {
  paddingLeft: '20px',
};

const listItem = {
  color: '#555555',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '5px 0',
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
