# E'MPIRE Perfumes — Next.js 14+ E-Commerce Redesign

A modern, high-converting luxury e-commerce application built for **E'MPIRE Perfumes** (`empireparfum.com`).

---

## 🌟 Key Features

1. **Dark Luxury Aesthetic**: Charcoal/black base with warm champagne-gold gradients, Playfair Display typography, and glassmorphism UI components.
2. **Interactive Fragrance Quiz**: "Find Your Scent" step-by-step recommendation engine (`/scent-quiz`).
3. **Custom Duo Box Builder**: Interactive 2-perfume combo selector for ₹4,999 (`/custom-box`).
4. **Persistent Cart Drawer**: Slide-out cart with quantity controls, free shipping progress bar, promo code logic (`EMPIRE10`), and real-time total calculations.
5. **Saved Wishlist**: Persistent localStorage wishlist with heart toggle buttons (`/wishlist`).
6. **Product Detail Pages**: Multi-image gallery, Top/Heart/Base notes pyramid visualizer, size indicator, and customer reviews (`/products/[id]`).
7. **Express Checkout Flow**: Integrated address form, payment gateway selectors (Razorpay, Stripe, Cash on Delivery), and instant order confirmation (`/checkout`).
8. **My Orders & Tracking**: Order history dashboard with status badges and tracking numbers (`/my-orders`).
9. **Reimagined Brand Story**: High-end brand heritage and philosophy presentation (`/our-story`).
10. **Ambient Audio Master Player**: Persistent background music toggle button.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ (App Router with TypeScript)
- **Styling**: Tailwind CSS & Custom Gold Gradient Utility Classes
- **State Management**: Zustand with `localStorage` persistence
- **Animations**: Framer Motion & Tailwind Animations
- **Icons**: Lucide React
- **Backend Integration Points**: Supabase JS Client & Razorpay / Stripe placeholder hooks

---

## 🚀 Setup & Run Instructions

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev

# 3. Open browser at:
# http://localhost:3000
```

---

## 🔌 CMS & Payment Integration Points

- **Product Catalog Data**: Located in [`lib/data/products.ts`](file:///c:/Users/lenovo/Documents/empire/lib/data/products.ts). This file can easily be replaced with a headless CMS fetch call (Sanity, Strapi, or REST API).
- **Payment Gateways**: Payment method selection in [`app/checkout/page.tsx`](file:///c:/Users/lenovo/Documents/empire/app/checkout/page.tsx) is pre-structured for Razorpay (`window.Razorpay`) and Stripe (`@stripe/stripe-js`) API triggers.
