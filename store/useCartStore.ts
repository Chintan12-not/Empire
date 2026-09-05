import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/types/product';
import { COMBO_OFFER } from '@/lib/data/products';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  promoCode: string | null;
  discountPercent: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number, isComboItem?: boolean) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addCombo: (p1: Product, p2: Product) => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  getTotals: () => {
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    freeShippingThreshold: number;
    isFreeShipping: boolean;
    amountNeededForFreeShipping: number;
    totalItems: number;
  };
}

const FREE_SHIPPING_THRESHOLD = 2000;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      promoCode: null,
      discountPercent: 0,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, quantity = 1, isComboItem = false) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id && item.isComboItem === isComboItem
          );
          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += quantity;
            return { items: updated, isOpen: true };
          }
          return {
            items: [...state.items, { product, quantity, isComboItem }],
            isOpen: true,
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [], promoCode: null, discountPercent: 0 }),

      addCombo: (p1, p2) => {
        // Add special custom box combo item
        const comboProduct: Product = {
          id: `combo-${p1.id}-${p2.id}`,
          name: `Custom Box of 2 (${p1.name} + ${p2.name})`,
          slug: 'custom-box-of-2',
          tagline: `Exclusive Duo: ${p1.name} & ${p2.name}`,
          price: COMBO_OFFER.comboPrice,
          originalPrice: p1.price + p2.price,
          gender: 'unisex',
          genderLabel: 'Custom Combo',
          size: '2x 50ml EDP',
          img: p1.img,
          images: [p1.img, p2.img],
          description: `Custom duo box containing 50ml ${p1.name} and 50ml ${p2.name}.`,
          notes: {
            top: `${p1.name}: ${p1.notes.top}`,
            heart: `${p2.name}: ${p2.notes.heart}`,
            base: 'Premium Custom Wooden Box Included',
          },
          rating: 5.0,
          totalReviews: 89,
          vibeTags: ['Combo', 'Custom Box', 'Best Value'],
          reviews: [],
        };

        set((state) => ({
          items: [...state.items, { product: comboProduct, quantity: 1, isComboItem: true }],
          isOpen: true,
        }));
      },

      applyPromoCode: (code: string) => {
        const cleanCode = code.trim().toUpperCase();
        const validCodes: Record<string, number> = {
          EMPIRE10: 10,
          ANTY07: 15,
          AMRIT09: 15,
          KRISHV19: 15,
          AVANI26: 15,
          SANJEEVANI26: 15,
          VEDU18: 15,
        };

        if (validCodes[cleanCode]) {
          set({ promoCode: cleanCode, discountPercent: validCodes[cleanCode] });
          return {
            success: true,
            message: `Promo code ${cleanCode} applied! (${validCodes[cleanCode]}% OFF)`,
          };
        }

        return { success: false, message: 'Invalid promo code. Try EMPIRE10' };
      },

      removePromoCode: () => set({ promoCode: null, discountPercent: 0 }),

      getTotals: () => {
        const { items, discountPercent } = get();
        const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

        const subtotal = items.reduce((acc, item) => {
          return acc + item.product.price * item.quantity;
        }, 0);

        const discount = Math.round((subtotal * discountPercent) / 100);
        const netAfterDiscount = subtotal - discount;

        const isFreeShipping = netAfterDiscount >= FREE_SHIPPING_THRESHOLD || items.length === 0;
        const shipping = isFreeShipping ? 0 : 150;
        const total = netAfterDiscount + shipping;
        const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - netAfterDiscount);

        return {
          subtotal,
          discount,
          shipping,
          total,
          freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
          isFreeShipping,
          amountNeededForFreeShipping,
          totalItems,
        };
      },
    }),
    {
      name: 'empire_cart_store',
    }
  )
);
