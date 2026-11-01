"use client";

import Link from "next/link";
import { BottomNav } from "@/components/ui/BottomNav";
import { Card } from "@/components/ui/Card";
import { formatDate, formatRub } from "@/lib/format";
import { buildHistoryEntries, type HistoryEntryKind } from "@/lib/historyEntries";
import { useAppState } from "@/state/AppStateContext";

const KIND_ICON: Record<HistoryEntryKind, string> = {
  donation: "🤝",
  payment: "💳",
  "fund-payout": "🏦",
};

export default function HistoryPage() {
  const { activeProfile } = useAppState();
  const entries = buildHistoryEntries(activeProfile);

  return (
    <div className="flex justify-center bg-surface">
      <div className="w-full max-w-md bg-white pb-28">
        <div className="px-6 py-6">
          <h1 className="text-h1 text-ink">История</h1>
          <p className="mt-2 text-body text-text-secondary">Переводы по сборам, платежи и списания фонда</p>

          <div className="mt-4 flex flex-col gap-2">
            {entries.length === 0 && <p className="text-body text-text-secondary">Пока пусто</p>}
            {entries.map((entry) => {
              const content = (
                <Card className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-lg">
                    {KIND_ICON[entry.kind]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body font-medium text-ink">{entry.title}</p>
                    <p className="mt-0.5 truncate text-caption text-text-secondary">{entry.subtitle}</p>
                    <p className="mt-0.5 text-caption text-text-secondary">{formatDate(entry.date)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-body font-semibold text-ink">
                    {formatRub(entry.amount)}
                    {entry.campaignId && <span className="text-ink">›</span>}
                  </div>
                </Card>
              );

              return entry.campaignId ? (
                <Link key={entry.id} href={`/campaigns/${entry.campaignId}`}>
                  {content}
                </Link>
              ) : (
                <div key={entry.id}>{content}</div>
              );
            })}
          </div>
        </div>
      </div>
      <BottomNav active="history" />
    </div>
  );
}
