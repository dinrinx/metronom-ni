import type { NextConfig } from "next";

// Метроном (/) и «Народные инвестиции» (/ni) живут в одном приложении, каждый со своим корневым layout.
const nextConfig: NextConfig = {
  // В dev двойной запуск эффектов в StrictMode затирает сохранённое состояние НИ (AppStateProvider); на проде его нет.
  reactStrictMode: false,
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
