"use client";

import Link from "next/link";
import { BottomNav } from "@/components/ui/BottomNav";
import { Card } from "@/components/ui/Card";
import { TrustRatingRing } from "@/components/ui/TrustRatingRing";
import { useAppState } from "@/state/AppStateContext";

const LEVELS = ["Новичок", "Активный бизнесмен", "Надёжный партнёр", "Стратегический партнёр"];

const FACTORS = [
  {
    title: "Обороты по счёту",
    body: "Чем стабильнее и предсказуемее поступления на счёт, тем выше вклад в рейтинг — разовые крупные суммы весят меньше, чем регулярность.",
  },
  {
    title: "Подключённые продукты",
    body: "Каждый продукт Альфы, который ты используешь (касса, приём платежей, эквайринг), — это дополнительные данные о бизнесе и плюс к рейтингу.",
  },
  {
    title: "Касса и эквайринг",
    body: "Легальный приём оплаты снижает риск для банка и напрямую влияет на доступные лимиты и условия по будущим продуктам.",
  },
  {
    title: "История сборов",
    body: "Завершённые сборы, отзывы донатеров и своевременные отчёты формируют часть альтернативной кредитной истории.",
  },
];

export default function RatingPage() {
  const { activeProfile } = useAppState();
  const { trustRating } = activeProfile;
  const currentIndex = LEVELS.indexOf(trustRating.level);

  return (
    <div className="flex justify-center bg-surface">
      <div className="w-full max-w-md bg-white pb-28">
        <div className="px-6 py-6">
          <Link href="/dashboard" className="text-2xl leading-none text-ink" aria-label="Назад">
            ‹
          </Link>
          <h1 className="mt-4 text-h1 text-ink">Как считается рейтинг доверия</h1>

          <div className="mt-6 flex flex-col items-center">
            <TrustRatingRing
              percent={trustRating.progressPercent}
              level={trustRating.level}
              nextLevel={trustRating.nextLevel}
            />
          </div>

          <p className="mt-6 text-caption font-semibold uppercase text-text-secondary">Уровни</p>
          <div className="mt-2 flex flex-col gap-2">
            {LEVELS.map((level, i) => {
              const done = i < currentIndex;
              const active = i === currentIndex;
              return (
                <div
                  key={level}
                  className={`flex items-center justify-between rounded-lg p-3 ${
                    active ? "bg-ink text-white" : "bg-surface text-ink"
                  }`}
                >
                  <span className="text-body font-medium">{level}</span>
                  {done && <span className={active ? "text-white" : "text-ink"}>✓</span>}
                  {active && <span className="text-caption text-white/70">сейчас ты здесь</span>}
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-caption font-semibold uppercase text-text-secondary">Из чего складывается рейтинг</p>
          <div className="mt-2 flex flex-col gap-2">
            {FACTORS.map((f) => (
              <Card key={f.title}>
                <p className="text-body font-semibold text-ink">{f.title}</p>
                <p className="mt-1 text-caption text-text-secondary">{f.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <BottomNav active="main" />
    </div>
  );
}
