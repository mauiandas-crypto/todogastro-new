import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'todogastro.com.uy',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;

// Cloudflare Pages configuration
export const config = {
  runtime: "edge",
};
