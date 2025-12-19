import { Html, Head, Preview, Body, Container, Section, Heading, Text, Button, Link } from '@react-email/components';

interface PasswordResetEmailProps {
  name: string;
  resetLink: string;
}

export function PasswordResetEmail({ name, resetLink }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Baabuji password</Preview>
      <Body style={{ backgroundColor: '#f6f6f6', fontFamily: 'sans-serif' }}>
        <Container style={{ backgroundColor: '#fff', margin: '0 auto', padding: '48px', maxWidth: '600px' }}>
          <Section style={{ backgroundColor: '#5c2e1f', padding: '32px 24px', textAlign: 'center' as const }}>
            <Heading style={{ color: '#fff', fontFamily: 'Georgia, serif', fontSize: '32px', margin: '0' }}>Baabuji</Heading>
          </Section>
          <Section style={{ padding: '32px 24px' }}>
            <Heading style={{ fontSize: '24px', marginBottom: '24px' }}>Reset Your Password</Heading>
            <Text>Hi {name},</Text>
            <Text>We received a request to reset your password. Click below:</Text>
            <Button style={{ backgroundColor: '#5c2e1f', color: '#fff', padding: '12px 32px', borderRadius: '4px', textDecoration: 'none', marginTop: '16px', marginBottom: '16px' }} href={resetLink}>Reset Password</Button>
            <Text>Link expires in 15 minutes.</Text>
            <Text>Did not request this? Ignore this email.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
