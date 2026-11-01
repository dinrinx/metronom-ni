import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatRub } from "@/lib/format";
import type { LastTransaction } from "@/types";

interface CompensationScreenProps {
  transaction: LastTransaction;
  onBack: () => void;
  onDone: () => void;
}

export function CompensationScreen({ transaction, onBack, onDone }: CompensationScreenProps) {
  const compensation = Math.round((transaction.amount * transaction.discountPercent) / 100);

  return (
    <div className="flex flex-col px-6 py-8">
      <button onClick={onBack} className="self-start text-2xl leading-none text-ink" aria-label="Назад">
        ‹
      </button>

      <div className="mt-4 flex flex-col">
        <h1 className="text-h1 text-ink">Альфа компенсирует скидку</h1>
        <p className="mt-3 text-body text-text-secondary">
          Донатер получил скидку сразу, а тебе не пришлось закладывать её в свою маржу — разницу возвращает банк.
        </p>

        <Card className="mt-6">
          <p className="text-caption uppercase text-text-secondary">Сумма возврата</p>
          <p className="mt-1 text-[26px] font-bold text-ink">{formatRub(compensation)}</p>
          <p className="mt-1 text-caption text-text-secondary">Поступит на счёт в течение 1 рабочего дня</p>
        </Card>
      </div>

      <div className="mt-8">
        <Button fullWidth onClick={onDone}>
          Понятно
        </Button>
      </div>
    </div>
  );
}
