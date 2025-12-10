'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductForm, ProductFormData } from '@/components/product-form';

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert price and comparePrice to paise (smallest unit)
      const priceInPaise = Math.round(parseFloat(data.price) * 100);
      const comparePriceInPaise = data.comparePrice
        ? Math.round(parseFloat(data.comparePrice) * 100)
        : null;

      // Convert tags string to array
      const tagsArray = data.tags
        ? data.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [];

      // Generate slug from product name
      const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const productData = {
        name: data.name,
        slug,
        description: data.description,
        category: data.category,
        fabricType: data.fabricType,
        pattern: data.pattern,
        color: data.color,
        price: priceInPaise,
        comparePrice: comparePriceInPaise,
        stock: parseInt(data.stock),
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        tags: tagsArray,
      };

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      await response.json();
      router.push(`/admin/products`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen py-12 bg-gray-50">
        <div className="container-custom max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin/products"
              className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center"
            >
              ← Back to Products
            </Link>
            <div className="mt-4">
              <h1 className="font-serif text-4xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-gray-600 mt-2">Create a new product listing for your catalog</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Product Form */}
          <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </main>
      <Footer />
    </>
  );
}