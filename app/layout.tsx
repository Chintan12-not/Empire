import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import AuthModal from '@/components/AuthModal';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import DiscountPopup from '@/components/DiscountPopup';

export const metadata: Metadata = {
  title: "E'MPIRE - Luxury Indian Perfumes & Fragrances",
  description:
    "Discover E'MPIRE's exclusive collection of premium Indian Eau De Parfums. Handcrafted luxury fragrances for men and women including Smoked Whisky, Ocean Aura, Crown of Dunes and more.",
  keywords: [
    'perfume',
    'luxury fragrance',
    'indian perfume',
    'eau de parfum',
    'premium scent',
    'empire perfume',
    'long lasting perfume India',
    'handcrafted perfume',
  ],
  authors: [{ name: "E'MPIRE Perfumes" }],
  openGraph: {
    title: "E'MPIRE - Luxury Indian Perfumes",
    description:
      'Experience the art of noble fragrances. Handcrafted luxury perfumes for men and women.',
    url: 'https://empireparfum.com',
    siteName: "E'MPIRE Perfumes",
    images: [
      {
        url: '/images/Smoked Whisky.jpg',
        width: 1200,
        height: 630,
        alt: "E'MPIRE Luxury Perfume Collection",
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "E'MPIRE - Luxury Indian Perfumes",
    description:
      'Experience the art of noble fragrances. Handcrafted luxury perfumes for men and women.',
    images: ['/images/Smoked Whisky.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
        {/* Structured Product Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Brand',
              name: "E'MPIRE Perfumes",
              url: 'https://empireparfum.com',
              logo: 'https://empireparfum.com/images/logo.png',
              sameAs: ['https://www.instagram.com/empireperfumes.official'],
              description: 'Luxury Indian Eau De Parfums for Men, Women & Unisex.',
            }),
          }}
        />
      </head>
      <body className="bg-charcoal-900 text-gray-100 font-sans antialiased selection:bg-gold-500 selection:text-charcoal-900">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />

        {/* Global Overlays & Modals */}
        <CartDrawer />
        <AuthModal />
        <FloatingWhatsApp />
        <DiscountPopup />
      </body>
    </html>
  );
}
