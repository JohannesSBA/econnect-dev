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
};

module.exports = nextConfig;
