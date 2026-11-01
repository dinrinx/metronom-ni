import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    return [
      {
        source: "/ni",
        destination: "http://localhost:3001/ni",
      },
      {
        source: "/ni/:path*",
        destination: "http://localhost:3001/ni/:path*",
      },
    ];
  },
};

export default nextConfig;
