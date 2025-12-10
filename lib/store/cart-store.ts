import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  imageAlt: string;
  category: string;
  fabricType: string;
  color: string;
  quantity: number;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // Computed values
  getTotalItems: () => number;
  getSubtotal: () => number;
  getItemCount: (productId: string) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      // Add item to cart
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.productId === item.productId);

        if (existingItem) {
          // Update quantity if item already exists
          const newQuantity = existingItem.quantity + (item.quantity || 1);
          
          // Check stock availability
          if (newQuantity > item.stock) {
            throw new Error(`Only ${item.stock} items available in stock`);
          }

          set({
            items: items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: newQuantity }
                : i
            ),
          });
        } else {
          // Add new item
          const newItem: CartItem = {
            ...item,
            quantity: item.quantity || 1,
          };

          // Check stock
          if (newItem.quantity > newItem.stock) {
            throw new Error(`Only ${newItem.stock} items available in stock`);
          }

          set({ items: [...items, newItem] });
        }

        // Auto-open cart when item is added
        set({ isOpen: true });
      },

      // Remove item from cart
      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        });
      },

      // Update item quantity
      updateQuantity: (productId, quantity) => {
        const items = get().items;
        const item = items.find((i) => i.productId === productId);

        if (!item) return;

        // Remove if quantity is 0 or less
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        // Check stock availability
        if (quantity > item.stock) {
          throw new Error(`Only ${item.stock} items available in stock`);
        }

        set({
          items: items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        });
      },

      // Clear entire cart
      clearCart: () => {
        set({ items: [] });
      },

      // Cart drawer controls
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      // Get total number of items
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // Get subtotal (in paise)
      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      // Get quantity of specific item
      getItemCount: (productId) => {
        const item = get().items.find((i) => i.productId === productId);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: 'baabuji-cart-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist items, not drawer state
      partialize: (state) => ({ items: state.items }),
    }
  )
);