/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['localhost', 'wolxccbehsbafyirgvgp.supabase.co'],
  },
  async rewrites() {
    return [
      {
        source: '/admin-secret.html',
        destination: '/admin',
      },
    ];
  },
};

export default nextConfig;
