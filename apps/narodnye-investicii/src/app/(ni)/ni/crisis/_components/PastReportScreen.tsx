import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDate, formatRub } from "@/lib/format";
import type { Campaign } from "@/types";

export function PastReportScreen({
  pastCampaign,
  onNext,
  onBack,
}: {
  pastCampaign: Campaign | undefined;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col px-6 py-8">
      <button onClick={onBack} className="self-start text-2xl leading-none text-ink" aria-label="Назад">
        ‹
      </button>
      <h1 className="mt-4 text-h1 text-ink">Прежде чем начать — отчёт по прошлому сбору</h1>
      <p className="mt-3 text-body text-text-secondary">
        Донатеры увидят его рядом с новым сбором — это укрепляет доверие к тому, что деньги тратятся по назначению.
      </p>

      {pastCampaign ? (
        <Card className="mt-6">
          <p className="text-caption uppercase text-text-secondary">Куплено</p>
          <p className="mt-1 text-card-title text-ink">{pastCampaign.title}</p>
          <div className="mt-3 flex items-center justify-between text-body text-ink">
            <span>Сумма</span>
            <span className="font-semibold">{formatRub(pastCampaign.goalAmount)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-body text-ink">
            <span>Дата</span>
            <span className="font-semibold">{formatDate(pastCampaign.createdAt)}</span>
          </div>
        </Card>
      ) : (
        <Card className="mt-6">
          <p className="text-body text-text-secondary">Прошлых сборов пока не было.</p>
        </Card>
      )}

      <div className="mt-8">
        <Button fullWidth onClick={onNext}>
          Продолжить
        </Button>
      </div>
    </div>
  );
}
