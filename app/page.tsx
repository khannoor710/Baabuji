import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary-900 mb-6">
                Premium Unstitched Fabrics
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Discover the finest collection of cotton, silk, linen, and blended materials
                for your ethnic wardrobe
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/shop" className="btn-primary">
                  Shop Now
                </Link>
                <Link href="/about" className="btn-outline">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-16">
          <div className="container-custom">
            <h2 className="font-serif text-3xl font-bold text-center mb-12">Shop by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['Men', 'Women', 'Kids'].map((category) => (
                <Link
                  key={category}
                  href={`/shop?category=${category.toUpperCase()}`}
                  className="card group cursor-pointer hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 group-hover:scale-105 transition-transform flex items-center justify-center">
                    <span className="font-serif text-4xl text-primary-900">{category}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-2xl font-bold text-center">{category}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-secondary-50 py-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="font-serif text-xl font-bold mb-2">Premium Quality</h3>
                <p className="text-gray-600">Handpicked fabrics from trusted suppliers</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="font-serif text-xl font-bold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">Quick shipping across India</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">💯</div>
                <h3 className="font-serif text-xl font-bold mb-2">Authentic Products</h3>
                <p className="text-gray-600">100% genuine materials guaranteed</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
