import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#f1e5ac',
          500: '#d4af37',
          600: '#b89628',
          700: '#8c701b',
        },
        charcoal: {
          900: '#050505',
          800: '#0a0a0a',
          700: '#121212',
          600: '#1a1a1a',
          500: '#262626',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #d4af37 0%, #f1e5ac 50%, #b89628 100%)',
        'gold-glow': 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(5, 5, 5, 0) 70%)',
        'dark-gradient': 'linear-gradient(180deg, #050505 0%, #0a0a0a 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
