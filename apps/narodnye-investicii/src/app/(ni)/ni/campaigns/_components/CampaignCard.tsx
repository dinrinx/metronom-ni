import { Card } from "@/components/ui/Card";
import { formatRub } from "@/lib/format";
import type { Campaign } from "@/types";

const TYPE_LABEL: Record<Campaign["type"], string> = {
  first: "Первый сбор",
  stability: "На устойчивость",
  crisis: "Пересматриваю стратегию",
};

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const raised = Math.round((campaign.goalAmount * campaign.raisedPercent) / 100);
  const barPercent = Math.min(100, campaign.raisedPercent);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <span className="text-caption font-semibold uppercase text-red">{TYPE_LABEL[campaign.type]}</span>
        <span className="text-caption text-text-secondary">{campaign.status}</span>
      </div>
      <p className="mt-2 text-card-title text-ink">{campaign.title}</p>
      <p className="mt-1 text-caption text-text-secondary">{campaign.goal}</p>

      <div className="mt-3 h-2 rounded-full bg-white">
        <div className="h-2 rounded-full bg-ink" style={{ width: `${barPercent}%` }} />
      </div>
      <div className="mt-2 flex items-center justify-between text-caption text-text-secondary">
        <span>
          {formatRub(raised)} из {formatRub(campaign.goalAmount)}
        </span>
        <span>{campaign.raisedPercent}%</span>
      </div>

      <p className="mt-3 text-caption text-text-secondary">{campaign.supportersCount} поддержавших</p>
      {campaign.bonuses.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {campaign.bonuses.map((b) => (
            <span key={b} className="rounded-full bg-white px-2.5 py-1 text-[11px] text-ink">
              {b}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
