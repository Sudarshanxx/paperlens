// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse"],
  },
  webpack: (config) => {
    // pdf-parse uses canvas which isn't available in Next.js build
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
