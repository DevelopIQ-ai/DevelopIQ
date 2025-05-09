/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@mastra/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: false, // Strict mode fetches all API calls twice in dev mode
  
  // Use redirects instead of rewrites to ensure the routes are handled properly
  async redirects() {
    return [
      {
        source: '/report',
        destination: '/',
        permanent: false,
      },
      {
        source: '/demo',
        destination: '/',
        permanent: false,
      },
      {
        source: '/search',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
