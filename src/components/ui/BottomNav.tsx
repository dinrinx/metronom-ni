"use client";

import Link from "next/link";

export type NavTab = "main" | "history" | "payments" | "storefront" | "chats";

const TABS: { key: NavTab; label: string; href: string }[] = [
  { key: "main", label: "Главный", href: "/dashboard" },
  { key: "history", label: "История", href: "/history" },
  { key: "payments", label: "Платежи", href: "/campaigns" },
  { key: "storefront", label: "Витрина", href: "/storefront" },
  { key: "chats", label: "Чаты", href: "/chats" },
];

export function BottomNav({ active }: { active: NavTab }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 flex justify-center border-t border-border-default/60 bg-white/95 backdrop-blur">
      <div className="flex w-full max-w-md items-stretch justify-between px-4 py-2">
        {TABS.map((tab) => {
          const isActive = tab.key === active;
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className="flex flex-1 flex-col items-center gap-1 rounded-lg px-1 py-2"
            >
              <span className={`h-2 w-2 rounded-full ${isActive ? "bg-red" : "bg-transparent"}`} />
              <span className={`text-[11px] leading-none ${isActive ? "font-semibold text-red" : "text-text-secondary"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
