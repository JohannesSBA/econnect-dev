/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en", "am"],
    defaultLocale: "en",
  },
  images: {
    domains: ["econnectbucket.s3.amazonaws.com"],
  },
};

module.exports = nextConfig;
