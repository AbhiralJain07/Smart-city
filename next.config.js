/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Fix for Next.js 16 Turbopack
  turbopack: {},

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },

  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;

