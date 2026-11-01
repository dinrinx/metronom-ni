import { Card } from "@/components/ui/Card";
import { formatDate, formatRub } from "@/lib/format";
import type { StabilityFundEntry } from "@/types";

const SPEND_OPTIONS = [
  "Прямая оплата поставщикам при кассовом разрыве",
  "Аренда и коммунальные платежи в сложный месяц",
  "Ремонт или замена оборудования",
];

export function StabilityFundScreen({
  amount,
  history,
  onBack,
}: {
  amount: number;
  history: StabilityFundEntry[];
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col px-6 py-8">
      <button onClick={onBack} className="self-start text-2xl leading-none text-ink" aria-label="Назад">
        ‹
      </button>

      <h1 className="mt-4 text-h1 text-ink">Фонд стабильности</h1>

      <Card inverse className="mt-4">
        <p className="text-caption uppercase text-white/70">Накоплено</p>
        <p className="mt-1 text-[26px] font-bold">{formatRub(amount)}</p>
      </Card>

      <p className="mt-6 text-caption font-semibold uppercase text-text-secondary">На что можно потратить</p>
      <div className="mt-2 flex flex-col gap-2">
        {SPEND_OPTIONS.map((o) => (
          <div key={o} className="rounded-lg bg-surface p-3 text-body text-ink">
            {o}
          </div>
        ))}
      </div>

      <p className="mt-6 text-caption font-semibold uppercase text-text-secondary">История списаний</p>
      <div className="mt-2 flex flex-col gap-2">
        {history.length === 0 && <p className="text-body text-text-secondary">Списаний ещё не было</p>}
        {history.map((entry, i) => (
          <div key={i} className="rounded-lg bg-surface p-3">
            <p className="text-body text-ink">
              Альфа оплатила «{entry.vendor}» напрямую — {formatRub(entry.amount)}
            </p>
            <p className="mt-1 text-caption text-text-secondary">{formatDate(entry.date)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
