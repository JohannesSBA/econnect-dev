/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["econnectbucket.s3.amazonaws.com"],
  },
};

module.exports = nextConfig;
