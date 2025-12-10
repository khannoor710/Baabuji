'use client';

import { useCartStore } from '@/lib/store/cart-store';

export function CartBadge() {
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const totalItems = getTotalItems();

  if (totalItems === 0) return null;

  return (
    <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-in fade-in zoom-in duration-200">
      {totalItems > 99 ? '99+' : totalItems}
    </span>
  );
}