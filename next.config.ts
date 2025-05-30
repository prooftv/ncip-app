import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
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

export default nextConfig;
