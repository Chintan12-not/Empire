import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, WishlistItem } from '@/types/product';

interface WishlistState {
  items: WishlistItem[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (product: Product) => {
        set((state) => {
          const exists = state.items.some((item) => item.product.id === product.id);
          if (exists) {
            return {
              items: state.items.filter((item) => item.product.id !== product.id),
            };
          }
          return {
            items: [
              ...state.items,
              { product, addedAt: new Date().toISOString() },
            ],
          };
        });
      },
      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.product.id === productId);
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'empire_wishlist_store',
    }
  )
);
