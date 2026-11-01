import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatRub } from "@/lib/format";

export function OverdraftOfferScreen({
  limit,
  onAccept,
  onBack,
}: {
  limit: number;
  onAccept: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col px-6 py-8">
      <button onClick={onBack} className="self-start text-2xl leading-none text-ink" aria-label="Назад">
        ‹
      </button>
      <h1 className="mt-4 text-h1 text-ink">Овердрафт для бизнеса</h1>

      <Card className="mt-4">
        <div className="flex items-center justify-between text-body text-ink">
          <span>Лимит</span>
          <span className="font-semibold">{formatRub(limit)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-body text-ink">
          <span>Ставка</span>
          <span className="font-semibold">14,9% годовых</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-body text-ink">
          <span>Срок</span>
          <span className="font-semibold">До 6 месяцев</span>
        </div>
      </Card>

      <p className="mt-4 text-caption text-text-secondary">
        Решение основано на истории использования продуктов внутри Контура доверия — без залога.
      </p>

      <div className="mt-8">
        <Button fullWidth onClick={onAccept}>
          Получить овердрафт
        </Button>
      </div>
    </div>
  );
}
