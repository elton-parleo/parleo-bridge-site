import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazon.com', 
      },
      {
        protocol: 'https',
        hostname: 'www.rei.com',
      },
      {
        protocol: 'https',
        hostname: '**.sephora.com', 
      },
      // This is a "catch-all" for other merchant images. 
      // Use it while developing, but narrow it down later for better security.
      {
        protocol: 'https',
        hostname: '**', 
      },
    ],
  },
  /* You can add other options here later, like redirects or headers */
};

export default nextConfig;