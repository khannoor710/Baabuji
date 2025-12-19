import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, calculateDiscountPercentage } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  image: string;
  imageAlt: string;
  category: string;
  inStock: boolean;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  comparePrice,
  image,
  imageAlt,
  category,
  inStock,
}: ProductCardProps) {
  const discount = comparePrice ? calculateDiscountPercentage(comparePrice, price) : 0;

  return (
    <Link 
      href={`/product/${slug}`} 
      className="card group cursor-pointer hover:shadow-xl transition-shadow"
      data-testid="product-card"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-accent-500 text-white px-2 py-1 rounded-md text-sm font-bold">
            {discount}% OFF
          </div>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{category}</p>
        <h3 className="font-serif text-lg font-semibold mb-2 line-clamp-2">{name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-primary-900 font-bold text-lg" data-testid="product-price">{formatPrice(price)}</span>
          {comparePrice && (
            <span className="text-gray-400 line-through text-sm">{formatPrice(comparePrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

// Memoize to prevent unnecessary re-renders in product grids
export default React.memo(ProductCard);
