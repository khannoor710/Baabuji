import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { formatPrice } from '@/lib/utils';

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
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
}

export function OrderConfirmationEmail({
  orderNumber,
  customerName,
  orderDate,
  items,
  subtotal,
  shipping,
  tax,
  total,
  shippingAddress,
}: OrderConfirmationEmailProps) {
  const formattedDate = new Date(orderDate).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Html>
      <Head />
      <Preview>Order Confirmation - {orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>Baabuji</Heading>
            <Text style={headerSubtitle}>Premium Unstitched Clothing</Text>
          </Section>

          {/* Order Confirmation */}
          <Section style={content}>
            <Heading style={h1}>Thank you for your order!</Heading>
            <Text style={text}>
              Hi {customerName},
            </Text>
            <Text style={text}>
              We've received your order and will process it shortly. You'll receive another email when your items have been shipped.
            </Text>

            {/* Order Details */}
            <Section style={orderInfo}>
              <Row>
                <Column>
                  <Text style={label}>Order Number</Text>
                  <Text style={value}>{orderNumber}</Text>
                </Column>
                <Column>
                  <Text style={label}>Order Date</Text>
                  <Text style={value}>{formattedDate}</Text>
                </Column>
              </Row>
            </Section>

            {/* Order Items */}
            <Heading style={h2}>Order Summary</Heading>
            {items.map((item, index) => (
              <Section key={index} style={itemRow}>
                <Row>
                  <Column style={itemImageColumn}>
                    {item.image && (
                      <Img
                        src={item.image}
                        alt={item.name}
                        width="80"
                        height="80"
                        style={itemImage}
                      />
                    )}
                  </Column>
                  <Column style={itemDetailsColumn}>
                    <Text style={itemName}>{item.name}</Text>
                    <Text style={itemQuantity}>Quantity: {item.quantity}</Text>
                  </Column>
                  <Column style={itemPriceColumn}>
                    <Text style={itemPrice}>
                      {formatPrice(item.price * item.quantity)}
                    </Text>
                  </Column>
                </Row>
              </Section>
            ))}

            {/* Order Totals */}
            <Section style={totals}>
              <Row style={totalRow}>
                <Column>
                  <Text style={totalLabel}>Subtotal</Text>
                </Column>
                <Column>
                  <Text style={totalValue}>{formatPrice(subtotal)}</Text>
                </Column>
              </Row>
              <Row style={totalRow}>
                <Column>
                  <Text style={totalLabel}>Shipping</Text>
                </Column>
                <Column>
                  <Text style={totalValue}>{formatPrice(shipping)}</Text>
                </Column>
              </Row>
              <Row style={totalRow}>
                <Column>
                  <Text style={totalLabel}>Tax</Text>
                </Column>
                <Column>
                  <Text style={totalValue}>{formatPrice(tax)}</Text>
                </Column>
              </Row>
              <Row style={totalRow}>
                <Column>
                  <Text style={totalLabelBold}>Total</Text>
                </Column>
                <Column>
                  <Text style={totalValueBold}>{formatPrice(total)}</Text>
                </Column>
              </Row>
            </Section>

            {/* Shipping Address */}
            <Heading style={h2}>Shipping Address</Heading>
            <Section style={addressBox}>
              <Text style={addressText}>{shippingAddress.fullName}</Text>
              <Text style={addressText}>{shippingAddress.addressLine1}</Text>
              {shippingAddress.addressLine2 && (
                <Text style={addressText}>{shippingAddress.addressLine2}</Text>
              )}
              <Text style={addressText}>
                {shippingAddress.city}, {shippingAddress.state}{' '}
                {shippingAddress.postalCode}
              </Text>
              <Text style={addressText}>{shippingAddress.country}</Text>
            </Section>

            {/* Track Order Button */}
            <Section style={buttonContainer}>
              <Link
                style={button}
                href={`${process.env.NEXT_PUBLIC_APP_URL}/account/orders`}
              >
                Track Your Order
              </Link>
            </Section>

            <Text style={footer}>
              If you have any questions, please contact us at{' '}
              <Link href="mailto:support@baabuji.com">support@baabuji.com</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default OrderConfirmationEmail;

// Styles
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
  padding: '0',
};

const headerSubtitle = {
  color: '#e8dcc8',
  fontSize: '14px',
  margin: '5px 0 0 0',
  padding: '0',
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
  margin: '30px 0 15px 0',
};

const text = {
  color: '#555555',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 10px 0',
};

const orderInfo = {
  backgroundColor: '#f9f9f9',
  borderRadius: '5px',
  padding: '15px',
  margin: '20px 0',
};

const label = {
  color: '#888888',
  fontSize: '12px',
  margin: '0 0 5px 0',
};

const value = {
  color: '#333333',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
};

const itemRow = {
  borderBottom: '1px solid #eeeeee',
  padding: '15px 0',
};

const itemImageColumn = {
  width: '80px',
  paddingRight: '15px',
};

const itemImage = {
  borderRadius: '5px',
};

const itemDetailsColumn = {
  verticalAlign: 'top' as const,
};

const itemName = {
  color: '#333333',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0 0 5px 0',
};

const itemQuantity = {
  color: '#888888',
  fontSize: '12px',
  margin: '0',
};

const itemPriceColumn = {
  textAlign: 'right' as const,
  verticalAlign: 'top' as const,
};

const itemPrice = {
  color: '#333333',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
};

const totals = {
  borderTop: '2px solid #eeeeee',
  marginTop: '20px',
  paddingTop: '15px',
};

const totalRow = {
  marginBottom: '10px',
};

const totalLabel = {
  color: '#555555',
  fontSize: '14px',
  margin: '0',
};

const totalValue = {
  color: '#555555',
  fontSize: '14px',
  textAlign: 'right' as const,
  margin: '0',
};

const totalLabelBold = {
  color: '#333333',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
};

const totalValueBold = {
  color: '#5c2e1f',
  fontSize: '16px',
  fontWeight: 'bold',
  textAlign: 'right' as const,
  margin: '0',
};

const addressBox = {
  backgroundColor: '#f9f9f9',
  borderRadius: '5px',
  padding: '15px',
  margin: '15px 0',
};

const addressText = {
  color: '#555555',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 5px 0',
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
