'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store/cart-store';
import { Button } from '@/components/ui/button';

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  productImageAlt: string;
  productSlug: string;
  productCategory: string;
  productFabricType: string;
  productColor: string;
  stock: number;
  className?: string;
}

export function AddToCartButton({
  productId,
  productName,
  productPrice,
  productImage,
  productImageAlt,
  productSlug,
  productCategory,
  productFabricType,
  productColor,
  stock,
  className,
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async () => {
    if (stock === 0) return;

    setIsAdding(true);

    // Add item to cart (addItem returns void, so no need to check success)
    addItem({
      id: productId,
      productId,
      name: productName,
      price: productPrice,
      image: productImage,
      imageAlt: productImageAlt,
      slug: productSlug,
      category: productCategory,
      fabricType: productFabricType,
      color: productColor,
      stock,
      quantity: 1,
    });

    setShowSuccess(true);

    // Show success state briefly
    setTimeout(() => {
      setShowSuccess(false);
      setIsAdding(false);
      // Open cart drawer after a brief moment
      setTimeout(() => {
        openCart();
      }, 100);
    }, 500);
  };

  return (
    <Button
      size="lg"
      className={className}
      disabled={stock === 0 || isAdding}
      onClick={handleAddToCart}
      isLoading={isAdding}
    >
      {showSuccess ? (
        <>
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          Added to Cart!
        </>
      ) : stock === 0 ? (
        'Out of Stock'
      ) : (
        <>
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
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          Add to Cart
        </>
      )}
    </Button>
  );
}