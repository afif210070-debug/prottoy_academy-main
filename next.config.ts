import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 🎯 আনস্প্ল্যাশের মেইন ডোমেইন এবং সাব-ডোমেইন দুটোরই সিকিউরিটি লক পার্মানেন্টলি আনলক করা হলো
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '://unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
