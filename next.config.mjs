/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['localhost', 'wolxccbehsbafyirgvgp.supabase.co'],
  },
  async redirects() {
    return [
      {
        source: '/admin-secret.html',
        destination: '/admin',
        permanent: false,
      },
      {
        source: '/admin-secret',
        destination: '/admin',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
