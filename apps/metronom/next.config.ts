import path from "node:path";
import type { NextConfig } from "next";

// Адрес зоны «Народные инвестиции»; в продакшене задаётся переменной окружения.
const niOrigin = process.env.NI_ORIGIN ?? "http://localhost:3001";

// На Vercel localhost недостижим: без NI_ORIGIN /ni молча отдавал бы 500, поэтому падаем на сборке.
if (process.env.VERCEL && !process.env.NI_ORIGIN) {
  throw new Error("NI_ORIGIN is required on Vercel: set it to the production URL of the narodnye-investicii project.");
}

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
