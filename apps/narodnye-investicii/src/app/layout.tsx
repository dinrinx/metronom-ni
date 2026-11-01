import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { AppStateProvider } from "@/state/AppStateContext";

const golosText = localFont({
  src: [
    { path: "./fonts/GolosText-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/GolosText-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/GolosText-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/GolosText-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/GolosText-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "./fonts/GolosText-Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-golos",
});

export const metadata: Metadata = {
  title: "Контур доверия",
  description: "Альфа-Банк — экосистема народных инвестиций для предпринимателей",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${golosText.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-ink font-sans">
        <AppStateProvider>
          <PhoneFrame>{children}</PhoneFrame>
        </AppStateProvider>
      </body>
    </html>
  );
}
