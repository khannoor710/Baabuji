import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-12">
        <div className="container-custom max-w-4xl">
          <h1 className="font-serif text-4xl font-bold mb-8">About Baabuji</h1>
          
          <div className="prose prose-lg">
            <p className="text-xl text-gray-700 mb-6">
              Welcome to Baabuji, your premier destination for premium unstitched fabrics.
            </p>
            
            <h2 className="font-serif text-2xl font-bold mt-8 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded with a passion for quality ethnic wear, Baabuji brings you the finest
              collection of unstitched fabrics from across India. We believe that every piece
              of fabric tells a story, and we&apos;re here to help you find yours.
            </p>
            
            <h2 className="font-serif text-2xl font-bold mt-8 mb-4">Our Promise</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>100% authentic, high-quality fabrics</li>
              <li>Handpicked materials from trusted suppliers</li>
              <li>Fair pricing with no hidden costs</li>
              <li>Fast and reliable delivery across India</li>
              <li>Excellent customer service</li>
            </ul>
            
            <div className="mt-8">
              <Link href="/shop" className="btn-primary">
                Explore Our Collection
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
