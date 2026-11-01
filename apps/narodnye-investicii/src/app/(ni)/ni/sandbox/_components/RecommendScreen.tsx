import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { NICHES, NICHE_RECOMMENDATIONS } from "@/lib/niches";
import type { IndustryId } from "@/types";

export function RecommendScreen({ niche, onOpenAccount }: { niche: IndustryId; onOpenAccount: () => void }) {
  const meta = NICHES.find((n) => n.id === niche)!;
  const rec = NICHE_RECOMMENDATIONS[niche];

  return (
    <div className="flex min-h-screen md:min-h-0 md:h-full flex-col px-6 py-8">
      <p className="text-caption font-semibold uppercase text-red">Для твоей ниши: {meta.label}</p>
      <h1 className="mt-2 text-h1 text-ink">{rec.heading}</h1>

      <Card className="mt-6">
        <div className="flex flex-col gap-3">
          {rec.products.map((p) => (
            <div key={p.name} className="flex items-center gap-3">
              <span
                className={`flex h-[30px] w-11 shrink-0 items-center justify-center rounded-sm text-base ${
                  p.solid ? "bg-red text-white" : "border-[1.5px] border-ink"
                }`}
              >
                {p.glyph ?? ""}
              </span>
              <span className="text-body font-medium text-ink">{p.name}</span>
            </div>
          ))}
        </div>
      </Card>

      <p className="mt-4 text-body text-text-secondary">{rec.body}</p>

      <div className="mt-auto pt-8">
        <Button fullWidth onClick={onOpenAccount}>
          Открыть счёт и запустить сбор
        </Button>
      </div>
    </div>
  );
}
