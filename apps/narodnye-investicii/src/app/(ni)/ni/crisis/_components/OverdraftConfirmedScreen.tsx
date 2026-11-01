import { Button } from "@/components/ui/Button";
import { formatRub } from "@/lib/format";

export function OverdraftConfirmedScreen({ amount, onDone }: { amount: number; onDone: () => void }) {
  return (
    <div className="flex flex-col items-center px-6 py-8 text-center">
      <div className="mt-10 flex h-16 w-16 items-center justify-center rounded-full bg-surface text-3xl">✓</div>
      <h1 className="mt-4 text-h1 text-ink">Средства получены ✓</h1>
      <p className="mt-2 text-[26px] font-bold text-ink">{formatRub(amount)}</p>
      <p className="mt-2 text-body text-text-secondary">Зачислены на счёт, можно распоряжаться сразу.</p>

      <div className="mt-10 w-full">
        <Button fullWidth onClick={onDone}>
          К дашборду
        </Button>
      </div>
    </div>
  );
}
