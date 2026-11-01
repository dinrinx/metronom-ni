import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GigaChat × Vercel — smoke test",
  description: "Диагностика OAuth, TLS и запроса к GigaChat из Vercel",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
