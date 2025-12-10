import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { prisma } from '@/lib/prisma';
import { formatPrice, calculateDiscountPercentage } from '@/lib/utils';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      images: {
        orderBy: { displayOrder: 'asc' },
      },
      reviews: {
        where: { isPublished: true },
        include: {
          user: {
            select: { name: true, image: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  return product;
}

import { Category } from '@prisma/client';

async function getRelatedProducts(productId: string, category: Category, limit = 4) {
  return prisma.product.findMany({
    where: {
      AND: [
        { id: { not: productId } },
        { category },
        { isActive: true },
        { stock: { gt: 0 } },
      ],
    },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160),
      images: product.images.map((img) => ({ url: img.url })),
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, product.category);
  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const discount = product.comparePrice
    ? calculateDiscountPercentage(product.comparePrice, product.price)
    : 0;

  // Calculate average rating
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

  return (
    <>
      <Header />
      <main className="min-h-screen py-8 bg-white">
        <div className="container-custom">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-600">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="hover:text-primary-700">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/shop" className="hover:text-primary-700">
                  Shop
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href={`/shop?category=${product.category}`}
                  className="hover:text-primary-700"
                >
                  {product.category}
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900 font-medium">{product.name}</li>
            </ol>
          </nav>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div>
              <div className="sticky top-20">
                {/* Main Image */}
                <div className="relative aspect-[4/5] mb-4 rounded-lg overflow-hidden bg-gray-100 group">
                  {primaryImage && (
                    <Image
                      src={primaryImage.url}
                      alt={primaryImage.altText || product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                  )}
                  {discount > 0 && (
                    <div className="absolute top-4 right-4 bg-accent-500 text-white px-3 py-1.5 rounded-md text-sm font-bold shadow-lg">
                      {discount}% OFF
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Thumbnail Images */}
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {product.images.map((image) => (
                      <div
                        key={image.id}
                        className="relative aspect-square rounded-md overflow-hidden border-2 border-gray-200 hover:border-primary-500 cursor-pointer transition-colors"
                      >
                        <Image
                          src={image.url}
                          alt={image.altText || product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full uppercase tracking-wide">
                  {product.category}
                </span>
              </div>

              <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              {product.reviews.length > 0 && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${
                          i < Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {avgRating.toFixed(1)} ({product.reviews.length} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-primary-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-2xl text-gray-400 line-through">
                      {formatPrice(product.comparePrice)}
                    </span>
                  )}
                </div>
                {product.stock > 0 && product.stock <= 10 && (
                  <p className="text-sm text-orange-600 mt-2 font-medium">
                    Only {product.stock} left in stock!
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-gray mb-8">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Product Attributes */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Fabric Type</p>
                  <p className="font-semibold text-gray-900">{product.fabricType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pattern</p>
                  <p className="font-semibold text-gray-900">{product.pattern}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Color</p>
                  <p className="font-semibold text-gray-900">{product.color}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Availability</p>
                  <p
                    className={`font-semibold ${
                      product.stock > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="mb-8">
                  <p className="text-sm text-gray-600 mb-2">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-4">
                <AddToCartButton
                  productId={product.id}
                  productName={product.name}
                  productPrice={product.price}
                  productImage={primaryImage?.url || ''}
                  productImageAlt={primaryImage?.altText || product.name}
                  productSlug={product.slug}
                  productCategory={product.category}
                  productFabricType={product.fabricType || ''}
                  productColor={product.color || ''}
                  stock={product.stock}
                  className="w-full"
                />
                <Button variant="outline" size="lg" className="w-full">
                  Add to Wishlist ♡
                </Button>
              </div>

              {/* Additional Info */}
              <div className="mt-8 pt-8 border-t space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>🚚</span>
                  <span>Free shipping on orders above ₹1,500</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>↩️</span>
                  <span>Easy 7-day returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>100% authentic product guarantee</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-20 pt-12 border-t">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-3xl font-bold text-gray-900">
                  You May Also Like
                </h2>
                <Link
                  href={`/shop?category=${product.category}`}
                  className="text-primary-700 hover:text-primary-800 font-medium"
                >
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => {
                  const relatedPrimaryImage =
                    relatedProduct.images[0] || { url: '', altText: relatedProduct.name };

                  return (
                    <ProductCard
                      key={relatedProduct.id}
                      id={relatedProduct.id}
                      name={relatedProduct.name}
                      slug={relatedProduct.slug}
                      price={relatedProduct.price}
                      comparePrice={relatedProduct.comparePrice || undefined}
                      image={relatedPrimaryImage.url}
                      imageAlt={relatedPrimaryImage.altText || relatedProduct.name}
                      category={relatedProduct.category}
                      inStock={relatedProduct.stock > 0}
                    />
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}