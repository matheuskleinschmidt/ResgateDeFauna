const path = require("path");

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
        urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
        handler: "NetworkOnly",
        method: "PUT",
        options: {
          backgroundSync: {
            name: "apiQueuePUT",
            options: {
              maxRetentionTime: 24 * 60,
            },
          },
        },
      },
      {
        urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
        handler: "NetworkOnly",
        method: "POST",
        options: {
          backgroundSync: {
            name: "apiQueuePOST",
            options: {
              maxRetentionTime: 24 * 60,
            },
          },
        },
      },
      {
        urlPattern: /^https?.*/,
        handler: "NetworkFirst",
        options: {
          cacheName: "offlineCache",
          expiration: {
            maxEntries: 200,
          },
        },
      },
      {
        urlPattern: /\/api\/.*$/,
        handler: "NetworkFirst",
        options: {
          cacheName: "apiCache",
          networkTimeoutSeconds: 10,
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 86400,
          },
          cacheableResponse: {
            statuses: [0, 200],
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
    config.resolve.alias["rlayers"] = path.resolve(
      dirname,
      "node_modules",
      "rlayers",
      "dist"
    );
    return config;
  },
};

module.exports = withPWA(nextConfig);
