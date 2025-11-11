/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.ejemplo*.com',
        pathname: '/**',
      },
    ],
  },

  // Optimizaciones para producción
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Variables de entorno públicas
  env: {
    NEXT_PUBLIC_APP_NAME: 'RAF-AI Casas Rurales',
  },
};

module.exports = nextConfig;
