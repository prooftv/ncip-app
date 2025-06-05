/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: 'loose'
  },
  webpack: (config, { isServer }) => {
    // Handle undici and other problematic packages
    config.resolve.fallback = {
      ...config.resolve.fallback,
      encoding: false,
      fs: false,
      net: false,
      tls: false,
    };

    // Exclude undici from being processed by webpack on the client side
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'undici': false,
      };
    }

    // Handle Firebase and other ESM packages
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push({
        'undici': 'commonjs undici'
      });
    }

    return config;
  },
};

module.exports = nextConfig;
