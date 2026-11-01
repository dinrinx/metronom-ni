import { Card } from "@/components/ui/Card";
import type { WalletSplit } from "@/lib/aiInsights";

const LABELS: { key: keyof WalletSplit; name: string; color: string }[] = [
  { key: "revenue", name: "Выручка", color: "#1D1D1B" },
  { key: "taxes", name: "Налоги", color: "#EF3124" },
  { key: "reserve", name: "Резерв", color: "#8D3AF6" },
  { key: "purchases", name: "Закупки", color: "#D9D9D6" },
];

export function WalletSplitCard({ split }: { split: WalletSplit }) {
  return (
    <Card>
      <p className="text-caption font-semibold uppercase text-text-secondary">Сплит выручки по «кошелькам»</p>

      <div className="mt-3 flex h-3 overflow-hidden rounded-full">
        {LABELS.map((l) => (
          <div key={l.key} style={{ width: `${split[l.key]}%`, backgroundColor: l.color }} />
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-1.5">
        {LABELS.map((l) => (
          <div key={l.key} className="flex items-center justify-between text-body text-ink">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: l.color }} />
              {l.name}
            </span>
            <span className="text-caption text-text-secondary">{split[l.key]}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
