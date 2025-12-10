import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-12">
        <div className="container-custom max-w-2xl">
          <h1 className="font-serif text-4xl font-bold mb-8">Contact Us</h1>
          
          <div className="card p-8">
            <h2 className="font-serif text-2xl font-bold mb-6">Get in Touch</h2>
            
            <div className="space-y-4 mb-8">
              <div>
                <h3 className="font-semibold mb-2">📧 Email</h3>
                <p className="text-gray-600">support@baabuji.com</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">📞 Phone</h3>
                <p className="text-gray-600">+91 98765 43210</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">🏢 Address</h3>
                <p className="text-gray-600">
                  123 Fashion Street<br />
                  Mumbai, Maharashtra 400001<br />
                  India
                </p>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <p className="text-gray-600 mb-4">
                Have questions? We&apos;d love to hear from you!
              </p>
              <Link href="/" className="btn-primary">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
