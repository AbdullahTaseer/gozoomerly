import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
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
