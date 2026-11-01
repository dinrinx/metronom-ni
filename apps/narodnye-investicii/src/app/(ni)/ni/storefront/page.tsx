"use client";

import { BottomNav } from "@/components/ui/BottomNav";
import { Card } from "@/components/ui/Card";
import { useAppState } from "@/state/AppStateContext";

const ALT_CREDIT_PRODUCTS = [
  { name: "Кредит", note: "Ставка ниже базовой — по истории сборов" },
  { name: "Лизинг", note: "Оборудование без залога недвижимости" },
  { name: "Факторинг", note: "Финансирование под будущие поступления" },
  { name: "Страхование", note: "Расширенное покрытие для бизнеса" },
];

export default function StorefrontPage() {
  const { activeProfile } = useAppState();

  return (
    <div className="flex justify-center bg-surface">
      <div className="w-full max-w-md bg-white pb-28">
        <div className="px-6 py-6">
          <h1 className="text-h1 text-ink">Витрина продуктов</h1>

          <p className="mt-4 text-caption font-semibold uppercase text-text-secondary">Уже подключено</p>
          <div className="mt-2 flex flex-col gap-2">
            {activeProfile.products.map((p) => (
              <Card key={p} className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-white text-lg">✓</span>
                <span className="text-body font-medium text-ink">{p}</span>
              </Card>
            ))}
          </div>

          <p className="mt-6 text-caption font-semibold uppercase text-text-secondary">
            {activeProfile.altCreditUnlocked ? "Стало доступно благодаря истории" : "Разблокируется по мере истории в Контуре доверия"}
          </p>
          <div className="mt-2 flex flex-col gap-2">
            {ALT_CREDIT_PRODUCTS.map((p) => (
              <Card
                key={p.name}
                className={`flex items-center justify-between ${activeProfile.altCreditUnlocked ? "" : "opacity-50"}`}
              >
                <div>
                  <p className="text-body font-medium text-ink">{p.name}</p>
                  <p className="mt-0.5 text-caption text-text-secondary">{p.note}</p>
                </div>
                <span className="text-lg">{activeProfile.altCreditUnlocked ? "🔓" : "🔒"}</span>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <BottomNav active="storefront" />
    </div>
  );
}
