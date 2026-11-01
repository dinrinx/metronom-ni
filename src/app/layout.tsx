import type { Metadata } from "next";
import { Golos_Text } from "next/font/google";
import "./globals.css";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { AppStateProvider } from "@/state/AppStateContext";

const golosText = Golos_Text({
  variable: "--font-golos",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
