const path = require('path');
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  webpack: (config) => {
    config.resolve.alias['@features'] = path.resolve(__dirname, 'src/features');
    config.resolve.alias['@components'] = path.resolve(__dirname, 'src/components');
    config.resolve.alias['@lib'] = path.resolve(__dirname, 'src/lib');
    config.resolve.alias['@models'] = path.resolve(__dirname, 'src/models');
    config.resolve.alias['@utils'] = path.resolve(__dirname, 'src/utils');
    return config;
  },
});
