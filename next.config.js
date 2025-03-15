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
  webSocketDebuggerUrl: true,
  experimental: {
    // This improves WebSocket support
    esmExternals: true,
    // This helps with socket.io
    outputFileTracingIgnores: ["**socket.io-client**"]
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
