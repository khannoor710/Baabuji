'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CheckoutForm } from '@/components/checkout-form';
import { useCartStore } from '@/lib/store/cart-store';
import { formatPrice } from '@/lib/utils';
import { useEffect, useState } from 'react';
import type { AddressData } from '@/components/address-form';
import type { PaymentMethod } from '@/components/payment-form';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalItems, getSubtotal, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  const totalItems = getTotalItems();
  const subtotal = getSubtotal();
  const shipping = subtotal >= 150000 ? 0 : 5000; // Free shipping over ₹1,500
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (isMounted && items.length === 0) {
      router.push('/cart');
    }
  }, [isMounted, items.length, router]);

  const handleCheckoutComplete = async (data: {
    address: AddressData;
    paymentMethod: PaymentMethod;
    paymentDetails?: Record<string, string>;
  }) => {
    try {
      // Create order via API
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            slug: item.slug,
            image: item.image,
          })),
          shippingAddress: data.address,
          paymentMethod: data.paymentMethod,
          paymentDetails: data.paymentDetails,
          subtotal,
          shipping,
          tax,
          total,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create order');
      }

      const { orderId } = await response.json();

      // Clear cart
      clearCart();

      // Redirect to order confirmation
      router.push(`/order-confirmation/${orderId}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred during checkout');
      throw error;
    }
  };

  const handleCancel = () => {
    router.push('/cart');
  };

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  if (items.length === 0) {
    return null; // Will redirect
  }

  return (
    <>
      <Header />
      <main className="min-h-screen py-12 bg-gray-50">
        <div className="container-custom">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
            <p className="text-gray-600">
              Complete your order in just a few steps
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <CheckoutForm
                total={total}
                onComplete={handleCheckoutComplete}
                onCancel={handleCancel}
              />
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4 pb-4 border-b">
                  Order Summary
                </h3>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                        <Image
                          src={item.image}
                          alt={item.imageAlt}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute -top-2 -right-2 bg-primary-700 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.color} • {item.fabricType}
                        </p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Tax (GST 18%)</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>

                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t">
                    <span>Total</span>
                    <span className="text-primary-900">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Secure SSL Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                    </svg>
                    <span>Free Returns within 7 Days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>100% Authentic Products</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}