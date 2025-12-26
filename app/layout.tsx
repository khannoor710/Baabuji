import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/auth-provider';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: {
    default: 'Baabuji - Premium Unstitched Clothing',
    template: '%s | Baabuji',
  },
  description:
    'Discover premium unstitched fabrics for ethnic wear. Quality cotton, silk, linen, and blended materials for men, women, and kids.',
  keywords: ['unstitched fabric', 'ethnic wear', 'Indian clothing', 'premium fabrics', 'cotton', 'silk', 'linen'],
  authors: [{ name: 'Baabuji' }],
  creator: 'Baabuji',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://baabuji.com',
    title: 'Baabuji - Premium Unstitched Clothing',
    description: 'Discover premium unstitched fabrics for ethnic wear',
    siteName: 'Baabuji',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baabuji - Premium Unstitched Clothing',
    description: 'Discover premium unstitched fabrics for ethnic wear',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, playfair.variable, 'font-sans antialiased')}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
