import type { NextConfig } from "next";

// Адрес проекта Метронома: всё, что не под /ni, проксируется туда, чтобы обе зоны жили на одном origin.
const metronomOrigin = process.env.METRONOM_ORIGIN ?? "http://localhost:3000";

if (process.env.VERCEL && !process.env.METRONOM_ORIGIN) {
  throw new Error("METRONOM_ORIGIN is required on Vercel: set it to the production URL of the metronom project.");
}

const nextConfig: NextConfig = {
  basePath: "/ni",
  // Запросы приходят через rewrites Метронома, в том числе с 127.0.0.1.
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: `${metronomOrigin}/`, basePath: false },
        // Всё кроме /ni и /ni/*: включая /_next/*, /api/* и /campaign-handoff.
        { source: "/:path((?!ni(?:/|$)).*)", destination: `${metronomOrigin}/:path`, basePath: false },
      ],
    };
  },
};

export default nextConfig;
