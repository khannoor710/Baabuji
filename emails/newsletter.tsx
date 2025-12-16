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

interface NewsletterEmailProps {
  content: string;
  unsubscribeToken: string;
}

export function NewsletterEmail({ content, unsubscribeToken }: NewsletterEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Latest news from Baabuji</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headerTitle}>Baabuji</Heading>
            <Text style={headerSubtitle}>Premium Unstitched Clothing</Text>
          </Section>

          <Section style={contentSection}>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              You're receiving this email because you subscribed to Baabuji newsletter.
              <br />
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/unsubscribe?token=${unsubscribeToken}`}
                style={unsubscribeLink}
              >
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default NewsletterEmail;

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

const contentSection = {
  padding: '30px 20px',
  color: '#555555',
  fontSize: '14px',
  lineHeight: '24px',
};

const footer = {
  borderTop: '1px solid #eeeeee',
  padding: '20px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#888888',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0',
};

const unsubscribeLink = {
  color: '#5c2e1f',
  textDecoration: 'underline',
};
