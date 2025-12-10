'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart-store';
import { CartBadge } from '@/components/cart-badge';
import { CartDrawer } from '@/components/cart-drawer';

export function Header() {
  const { openCart } = useCartStore();

  return (
    <>
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="font-serif text-2xl font-bold text-primary-900">
              Baabuji
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/shop" className="text-gray-700 hover:text-primary-700 transition-colors">
                Shop
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-primary-700 transition-colors">
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-primary-700 transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Cart Button */}
              <button
                onClick={openCart}
                className="relative text-gray-700 hover:text-primary-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
                aria-label="Open shopping cart"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <CartBadge />
              </button>

              {/* Account Link */}
              <Link
                href="/account"
                className="text-gray-700 hover:text-primary-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
                aria-label="Account"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
