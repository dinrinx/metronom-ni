import type { NextConfig } from "next";

// «Народные инвестиции» (/ni) открываются первыми, Метроном — по переходу из НИ (/campaign-handoff) или напрямую на /metronom.
// Оба живут в одном приложении, каждый со своим корневым layout.
const nextConfig: NextConfig = {
  // В dev двойной запуск эффектов в StrictMode затирает сохранённое состояние НИ (AppStateProvider); на проде его нет.
  reactStrictMode: false,
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [{ source: "/", destination: "/ni", permanent: false }];
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
