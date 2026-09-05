import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';
import { Order } from '@/types/product';

interface UserProfile {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthModalOpen: boolean;
  orders: Order[];
  openAuthModal: () => void;
  closeAuthModal: () => void;
  setUser: (user: UserProfile | null) => void;
  logout: () => Promise<void>;
  fetchOrders: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthModalOpen: false,
  orders: [
    {
      id: 'EMP-9821',
      date: '2026-02-15',
      status: 'Delivered',
      total: 4999,
      shippingAddress: 'Sector 31, Faridabad, Haryana - 121003',
      trackingNumber: 'DEL-8891230',
      items: [
        {
          id: 'whisky',
          name: 'Smoked Whisky (50ml EDP)',
          price: 2800,
          quantity: 1,
          img: '/images/Smoked Whisky.jpg',
        },
        {
          id: 'ocean',
          name: 'Ocean Aura (50ml EDP)',
          price: 2800,
          quantity: 1,
          img: '/images/Ocean Aura.jpg',
        },
      ],
    },
    {
      id: 'EMP-8742',
      date: '2026-01-10',
      status: 'Shipped',
      total: 4200,
      shippingAddress: 'Bandra West, Mumbai, Maharashtra - 400050',
      trackingNumber: 'IND-7718293',
      items: [
        {
          id: 'crown',
          name: 'Crown of Dunes (50ml EDP)',
          price: 4200,
          quantity: 1,
          img: '/images/Crown of Dunes 1.jpg',
        },
      ],
    },
  ],

  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setUser: (user) => set({ user }),

  logout: async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    set({ user: null });
  },

  fetchOrders: () => {
    // Demo orders loaded
  },
}));
