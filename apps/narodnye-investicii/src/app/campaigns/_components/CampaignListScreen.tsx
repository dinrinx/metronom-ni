import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatRub } from "@/lib/format";
import type { BusinessProfile } from "@/types";
import { CampaignCard } from "./CampaignCard";

interface Props {
  profile: BusinessProfile;
  onOpenLastPayment: () => void;
  onOpenFund: () => void;
  onNewStability: () => void;
}

export function CampaignListScreen({ profile, onOpenLastPayment, onOpenFund, onNewStability }: Props) {
  return (
    <div className="flex flex-col px-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-ink">Сборы</h1>
        <Link
          href="/campaigns/new"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-xl font-semibold text-white"
          aria-label="Создать сбор"
        >
          +
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {profile.campaigns.map((c) => (
          <Link key={c.id} href={`/campaigns/${c.id}`}>
            <CampaignCard campaign={c} />
          </Link>
        ))}
      </div>

      <button onClick={onOpenLastPayment} className="mt-4 text-left">
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-caption uppercase text-text-secondary">Последняя транзакция</p>
            <p className="mt-1 text-body font-semibold text-ink">{formatRub(profile.lastTransaction.amount)}</p>
          </div>
          <span className="text-ink">›</span>
        </Card>
      </button>

      <button onClick={onOpenFund} className="mt-3 text-left">
        <Card inverse className="flex items-center justify-between">
          <div>
            <p className="text-caption uppercase text-white/70">Фонд стабильности</p>
            <p className="mt-1 text-body font-semibold">{formatRub(profile.stabilityFund)}</p>
          </div>
          <span>›</span>
        </Card>
      </button>

      <div className="mt-6">
        <Button fullWidth variant="secondary" onClick={onNewStability}>
          Запустить сбор «на устойчивость»
        </Button>
      </div>
    </div>
  );
}
