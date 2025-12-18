'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { useCartStore, CartItem as CartItemType } from '@/lib/store/cart-store';
import { useState } from 'react';

interface CartItemProps {
  item: CartItemType;
  variant?: 'drawer' | 'page';
}

export function CartItem({ item, variant = 'drawer' }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    setIsUpdating(true);
    try {
      updateQuantity(item.productId, newQuantity);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update quantity');
      // Revert on error
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = () => {
    if (confirm('Remove this item from cart?')) {
      removeItem(item.productId);
    }
  };

  const lineTotal = item.price * item.quantity;

  if (variant === 'drawer') {
    return (
      <div className="flex gap-4 py-4 border-b border-gray-200" data-testid="cart-item">
        {/* Product Image */}
        <Link href={`/product/${item.slug}`} className="flex-shrink-0">
          <div className="relative w-20 h-24 rounded-md overflow-hidden bg-gray-100">
            <Image
              src={item.image}
              alt={item.imageAlt}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/product/${item.slug}`}
            className="font-medium text-gray-900 hover:text-primary-700 line-clamp-2 text-sm"
          >
            {item.name}
          </Link>
          <p className="text-xs text-gray-500 mt-1">
            {item.fabricType} • {item.color}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-semibold text-primary-900">
              {formatPrice(item.price)}
            </span>
            <span className="text-xs text-gray-400">×</span>
            <span className="text-xs text-gray-600">{item.quantity}</span>
          </div>
        </div>

        {/* Quantity Controls & Remove */}
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-600 transition-colors"
            aria-label="Remove item"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              aria-label="Decrease quantity"
              data-testid="decrease-quantity"
            >
              −
            </button>
            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating || item.quantity >= item.stock}
              className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              aria-label="Increase quantity"
              data-testid="increase-quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Page variant (larger, more detailed)
  return (
    <div className="flex gap-6 py-6 border-b border-gray-200">
      {/* Product Image */}
      <Link href={`/product/${item.slug}`} className="flex-shrink-0">
        <div className="relative w-32 h-40 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            className="object-cover hover:scale-105 transition-transform"
            sizes="128px"
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1">
        <div className="flex justify-between gap-4">
          <div>
            <Link
              href={`/product/${item.slug}`}
              className="font-serif text-xl font-semibold text-gray-900 hover:text-primary-700"
            >
              {item.name}
            </Link>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-gray-100 rounded">{item.category}</span>
              <span>{item.fabricType}</span>
              <span>•</span>
              <span>{item.color}</span>
            </div>
            {item.stock <= 10 && (
              <p className="text-sm text-orange-600 mt-2">
                Only {item.stock} left in stock
              </p>
            )}
          </div>

          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-600 transition-colors h-6"
            aria-label="Remove item"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Quantity and Price */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 1}
                className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="px-6 py-2 font-medium min-w-[4rem] text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isUpdating || item.quantity >= item.stock}
                className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">
              {formatPrice(item.price)} × {item.quantity}
            </p>
            <p className="text-2xl font-bold text-primary-900">{formatPrice(lineTotal)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}