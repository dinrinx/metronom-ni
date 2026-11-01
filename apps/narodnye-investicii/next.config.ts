import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/ni",
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
