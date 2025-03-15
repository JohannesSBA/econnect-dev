/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en", "am"],
    defaultLocale: "en",
  },
  images: {
    domains: ["econnectbucket.s3.amazonaws.com"],
  },
  // Add specific support for WebSockets
  experimental: {
    // This improves WebSocket support
    esmExternals: true,
    // This helps with socket.io - updated to proper object format
    outputFileTracingExcludes: {
      "**socket.io-client**": true
    },
    // Optimize build performance
    memoryBasedWorkersCount: true, // Optimize worker count based on memory
    optimizePackageImports: ['@radix-ui/react-dialog', '@radix-ui/react-slot', 'lucide-react', 'framer-motion']
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      dns: false,
      child_process: false,
      tls: false,
    };

    config.cache = {
      type: "filesystem",
      buildDependencies: {
        config: [__filename],
      },
      cacheDirectory: path.resolve(__dirname, ".next_cache"),
      name: "my-next-cache",
      // Optimize cache performance
      compression: 'gzip',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    };

    // Reduce build size and improve performance
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      chunkIds: 'deterministic',
    };

    return config;
  },
  // Explicitly allow WebSocket connections on the server
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Connection',
            value: 'keep-alive'
          },
          {
            key: 'Upgrade',
            value: 'websocket'
          }
        ]
      }
    ]
  }
};

module.exports = nextConfig;
