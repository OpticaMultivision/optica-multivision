/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    domains: [
      "bazar-website.s3.ap-south-1.amazonaws.com",
      "customers-ecommerce.s3.us-east-1.amazonaws.com",
      "optica-multivision.s3.us-east-1.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;