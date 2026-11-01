import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/ni",
  // Запросы приходят через rewrites Метронома, в том числе с 127.0.0.1.
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
