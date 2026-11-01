import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatRub } from "@/lib/format";
import type { BusinessProfile } from "@/types";

export function FinalScreen({ profile, onProceed }: { profile: BusinessProfile; onProceed: () => void }) {
  const amount = profile.sandboxResult?.recommendedAmount ?? 0;

  return (
    <div className="flex min-h-screen md:min-h-0 md:h-full flex-col px-6 py-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-2xl">✓</div>
      <h1 className="mt-4 text-h1 text-ink">Счёт открыт</h1>
      <p className="mt-3 text-body text-text-secondary">
        Реквизиты уже в приложении. Дальше — сразу к первому сбору для «{profile.industryLabel}».
      </p>

      <Card className="mt-6">
        <p className="text-caption uppercase text-text-secondary">Первый сбор</p>
        <p className="mt-1 text-card-title text-ink">Старт для «{profile.industryLabel}»</p>
        <p className="mt-2 text-[22px] font-bold text-ink">{formatRub(amount)}</p>
        <p className="mt-1 text-caption text-text-secondary">Рекомендовано по расчёту в песочнице</p>
      </Card>

      <div className="mt-auto pt-8">
        <Button fullWidth onClick={onProceed}>
          Запустить сбор
        </Button>
      </div>
    </div>
  );
}
