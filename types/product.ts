export interface FragranceNotes {
  top: string;
  heart: string;
  base: string;
}

export interface Review {
  id: string;
  name: string;
  stars: number;
  date: string;
  text: string;
  verified: boolean;
  userPhoto?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  price: number;
  originalPrice: number;
  gender: 'him' | 'her' | 'unisex';
  genderLabel: string;
  size: string;
  img: string;
  images: string[];
  description: string;
  notes: FragranceNotes;
  rating: number;
  totalReviews: number;
  reviews: Review[];
  isBestseller?: boolean;
  isNew?: boolean;
  accentColor?: string;
  vibeTags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  isComboItem?: boolean;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  img: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: OrderItem[];
  trackingNumber?: string;
  shippingAddress?: string;
}
