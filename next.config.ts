import type { NextConfig } from 'next';

// Regular Next.js configuration
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  eslint: {
    // Disable linting during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript errors during build
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@features': '/workspaces/ncip-app/src/features',
      '@components': '/workspaces/ncip-app/src/components',
      '@lib': '/workspaces/ncip-app/src/lib',
      '@models': '/workspaces/ncip-app/src/models',
      '@utils': '/workspaces/ncip-app/src/utils',
    };
    return config;
  }
};

// Conditionally apply PWA in production
if (process.env.NODE_ENV === 'production') {
  const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: false,
  });
  module.exports = withPWA(nextConfig);
} else {
  module.exports = nextConfig;
}
