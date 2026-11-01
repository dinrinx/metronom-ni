import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { InfoTerm } from "@/components/ui/InfoTerm";
import { formatRub } from "@/lib/format";
import type { RiskLevel, SandboxResult } from "@/types";

const RISK_LABEL: Record<RiskLevel, string> = { low: "Низкий риск", medium: "Средний риск", high: "Высокий риск" };
const RISK_INDEX: Record<RiskLevel, number> = { low: 0, medium: 1, high: 2 };

export function ResultScreen({ result, onNext }: { result: SandboxResult; onNext: () => void }) {
  const activeIndex = RISK_INDEX[result.risk];

  return (
    <div className="flex min-h-screen md:min-h-0 md:h-full flex-col px-6 py-8">
      <h1 className="text-h1 text-ink">Готово! Вот что получилось</h1>

      <div className="mt-6 flex flex-col gap-3">
        <Card>
          <p className="text-caption uppercase text-text-secondary">
            <InfoTerm
              term="Стартовый капитал"
              definition="Сумма, которая нужна, чтобы запустить бизнес и продержаться первые месяцы"
            />
          </p>
          <p className="mt-1 text-[26px] font-bold text-ink">≈ {formatRub(result.capital)}</p>
        </Card>

        <Card>
          <p className="text-caption uppercase text-text-secondary">
            <InfoTerm
              term="Срок окупаемости"
              definition="Через сколько месяцев бизнес начнёт приносить больше, чем тратит"
            />
          </p>
          <p className="mt-1 text-[26px] font-bold text-ink">≈ {result.paybackMonths} мес.</p>
        </Card>

        <Card>
          <p className="text-caption uppercase text-text-secondary">
            Риск{" "}
            <InfoTerm
              term="кассового разрыва"
              definition="Риск, что в моменте не хватит денег на текущие расходы"
            />
          </p>
          <div className="mt-3 flex gap-1">
            {(["low", "medium", "high"] as RiskLevel[]).map((level, i) => (
              <span
                key={level}
                className="h-2 flex-1 rounded-full"
                style={{
                  backgroundColor: i > activeIndex ? "#EBE9E6" : i === 0 ? "#BFD9B8" : i === 1 ? "#F2C879" : "#EF3124",
                }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-caption text-text-secondary">
            <span>Низкий</span>
            <span>Средний</span>
            <span>Высокий</span>
          </div>
          <p className="mt-3 text-body font-semibold" style={{ color: "#B8501E" }}>
            {RISK_LABEL[result.risk]}
          </p>
        </Card>

        <Card inverse>
          <p className="text-caption uppercase text-white/70">Рекомендуем на первый сбор</p>
          <p className="mt-1 text-[26px] font-bold">{formatRub(result.recommendedAmount)}</p>
          <p className="mt-1 text-caption text-white/70">Через Народные инвестиции</p>
        </Card>
      </div>

      <div className="mt-8">
        <Button fullWidth onClick={onNext}>
          К рекомендациям →
        </Button>
      </div>
    </div>
  );
}
