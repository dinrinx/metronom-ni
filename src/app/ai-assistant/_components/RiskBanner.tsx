import Link from "next/link";

export function RiskBanner({ daysAway, advice }: { daysAway: number | null; advice: string | null }) {
  if (daysAway === null) {
    return (
      <div className="rounded-lg bg-surface p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl">🙂</span>
          <div>
            <p className="text-body font-semibold text-ink">Всё в порядке</p>
            <p className="mt-0.5 text-caption text-text-secondary">AI не видит рисков по счёту в ближайший месяц</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg p-4" style={{ backgroundColor: "#FBEAE8" }}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl">⚠️</span>
        <div>
          <p className="text-body font-semibold text-ink">Риск кассового разрыва через {daysAway} дней</p>
        </div>
      </div>
      {advice && <p className="mt-3 text-body text-text-secondary">{advice}</p>}
      <Link href="/crisis" className="mt-3 inline-block text-caption font-semibold text-red underline underline-offset-4">
        Посмотреть рекомендацию →
      </Link>
    </div>
  );
}
