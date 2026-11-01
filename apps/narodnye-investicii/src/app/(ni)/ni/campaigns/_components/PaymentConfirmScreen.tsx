import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatRub } from "@/lib/format";
import type { LastTransaction } from "@/types";

export function PaymentConfirmScreen({
  transaction,
  onNext,
  onBack,
}: {
  transaction: LastTransaction;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col px-6 py-8">
      <button onClick={onBack} className="self-start text-2xl leading-none text-ink" aria-label="Назад">
        ‹
      </button>

      <div className="mt-4 flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface text-3xl">✓</div>
        <h1 className="mt-4 text-h1 text-ink">Оплата прошла ✓</h1>
        <p className="mt-2 text-[26px] font-bold text-ink">{formatRub(transaction.amount)}</p>

        <Card className="mt-6 w-full text-left">
          <div className="flex items-center justify-between text-body text-ink">
            <span>Скидка донатеру</span>
            <span className="font-semibold text-red">−{transaction.discountPercent}%</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-body text-ink">
            <span>Проведено через</span>
            <span className="font-semibold">{transaction.viaProduct}</span>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <Button fullWidth onClick={onNext}>
          Как это компенсируется →
        </Button>
      </div>
    </div>
  );
}
