/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  },
  images: {
    unoptimized: true, // Ajout de cette ligne pour le support mobile
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',  // Permet tous les domaines
        pathname: '**',
      }
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  }
};

module.exports = nextConfig;