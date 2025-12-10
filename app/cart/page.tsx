'use client';

import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/components/cart-item';
import { useCartStore } from '@/lib/store/cart-store';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, getTotalItems, getSubtotal, clearCart } = useCartStore();
  const totalItems = getTotalItems();
  const subtotal = getSubtotal();

  // Calculate estimated shipping and tax (simplified)
  const shipping = subtotal >= 150000 ? 0 : 5000; // Free shipping over ₹1500
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  return (
    <>
      <Header />
      <main className="min-h-screen py-12 bg-gray-50">
        <div className="container-custom">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">
              {totalItems === 0
                ? 'Your cart is empty'
                : `${totalItems} ${totalItems === 1 ? 'item' : 'items'} in your cart`}
            </p>
          </div>

          {items.length === 0 ? (
            /* Empty Cart State */
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-8xl mb-6">🛒</div>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven&apos;t added any items yet. Start exploring our beautiful
                collection of premium fabrics!
              </p>
              <Link href="/shop">
                <Button size="lg">Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            /* Cart with Items */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm">
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Cart Items</h2>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            'Are you sure you want to clear your cart? This action cannot be undone.'
                          )
                        ) {
                          clearCart();
                        }
                      }}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear Cart
                    </button>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <CartItem key={item.productId} item={item} variant="page" />
                    ))}
                  </div>
                </div>

                {/* Continue Shopping */}
                <div className="mt-6">
                  <Link
                    href="/shop"
                    className="text-primary-700 hover:text-primary-800 font-medium inline-flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm sticky top-24">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-900">Order Summary</h2>
                  </div>

                  <div className="px-6 py-4 space-y-4">
                    {/* Subtotal */}
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal ({totalItems} items)</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>

                    {/* Free Shipping Progress */}
                    {shipping > 0 && subtotal < 150000 && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-xs text-blue-800 mb-2">
                          Add {formatPrice(150000 - subtotal)} more for FREE shipping! 🚚
                        </p>
                        <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all duration-500"
                            style={{ width: `${Math.min((subtotal / 150000) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Tax */}
                    <div className="flex justify-between text-gray-700">
                      <span>
                        Tax (GST 18%)
                        <button
                          className="ml-1 text-gray-400 hover:text-gray-600"
                          title="Goods and Services Tax"
                        >
                          ⓘ
                        </button>
                      </span>
                      <span className="font-medium">{formatPrice(tax)}</span>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200" />

                    {/* Total */}
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-primary-900">{formatPrice(total)}</span>
                    </div>

                    {/* Checkout Button */}
                    <Link href="/checkout" className="block">
                      <Button size="lg" className="w-full">
                        Proceed to Checkout
                      </Button>
                    </Link>

                    {/* Trust Badges */}
                    <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Secure 256-bit SSL Checkout</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                        </svg>
                        <span>Free Returns within 7 Days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
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
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}