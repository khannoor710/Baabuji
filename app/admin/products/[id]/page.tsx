'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductForm, ProductFormData } from '@/components/product-form';
import { Button } from '@/components/ui/button';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [initialData, setInitialData] = useState<Partial<ProductFormData> | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/admin/products/${productId}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        
        const data = await response.json();
        const product = data.product;

        // Convert price from paise to rupees for display
        setInitialData({
          name: product.name,
          description: product.description,
          category: product.category,
          fabricType: product.fabricType,
          pattern: product.pattern,
          color: product.color,
          price: (product.price / 100).toFixed(2),
          comparePrice: product.comparePrice ? (product.comparePrice / 100).toFixed(2) : '',
          stock: product.stock.toString(),
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          tags: product.tags.join(', '),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setIsFetching(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const priceInPaise = Math.round(parseFloat(data.price) * 100);
      const comparePriceInPaise = data.comparePrice
        ? Math.round(parseFloat(data.comparePrice) * 100)
        : null;

      const tagsArray = data.tags
        ? data.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [];

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

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isFetching) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-12 bg-gray-50">
          <div className="container-custom max-w-4xl">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading product...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!initialData) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-12 bg-gray-50">
          <div className="container-custom max-w-4xl">
            <div className="text-center py-12">
              <p className="text-red-600">Product not found</p>
              <Link href="/admin/products" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
                ← Back to Products
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
            <div className="flex items-center justify-between mt-4">
              <div>
                <h1 className="font-serif text-4xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-gray-600 mt-2">Update product details and inventory</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 hover:text-red-700"
                disabled={isLoading}
              >
                Delete Product
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Product Form */}
          <ProductForm initialData={initialData} onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </main>
      <Footer />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Product?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                isLoading={isLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}