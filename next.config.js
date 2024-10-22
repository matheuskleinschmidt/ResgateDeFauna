const path = require('path');
const url = require('url');

/** @type {import('next').NextConfig} */

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
        handler: 'NetworkOnly',
        method: 'POST',
        options: {
          backgroundSync: {
            name: 'apiQueue',
            options: {
              maxRetentionTime: 24 * 60,
            },
          },
        },
      },
    ],
  },
});

const dirname = __dirname; 

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["sequelize"],
    esmExternals: true,
  },
  webpack: (config) => {
    config.resolve.alias['rlayers'] = path.resolve(dirname, 'node_modules', 'rlayers', 'dist');
    return config;
  },
};

module.exports = withPWA(nextConfig);
