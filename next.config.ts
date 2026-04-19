import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    domains: [
      "images.unsplash.com",
      "cdn.pixabay.com",
      "lh3.googleusercontent.com",
      "iyjakrnzufohfkctyzbt.supabase.co",
      "example.com",
    ],
  },
};

export default nextConfig;
