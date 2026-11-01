import path from "node:path";
import type { NextConfig } from "next";

// Адрес зоны «Народные инвестиции»; в продакшене задаётся переменной окружения.
const niOrigin = process.env.NI_ORIGIN ?? "http://localhost:3001";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    return [
      {
        source: "/ni",
        destination: `${niOrigin}/ni`,
      },
      {
        source: "/ni/:path*",
        destination: `${niOrigin}/ni/:path*`,
      },
    ];
  },
};

export default nextConfig;
