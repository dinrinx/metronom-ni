import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/format";
import type { LegalCard } from "@/lib/legalCards";

export function CardDetailScreen({ card, onBack }: { card: LegalCard; onBack: () => void }) {
  return (
    <div className="flex flex-col px-6 py-8">
      <button onClick={onBack} className="self-start text-2xl leading-none text-ink" aria-label="Назад">
        ‹
      </button>

      <p className="mt-4 text-caption font-semibold uppercase text-red">{card.category}</p>
      <h1 className="mt-2 text-h1 text-ink">{card.question}</h1>
      <p className="mt-4 text-body text-ink">{card.answer}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-surface px-3 py-1.5 text-caption text-text-secondary">
          Актуально на {formatDate(card.updatedDate)}
        </span>
        <span className="rounded-full bg-surface px-3 py-1.5 text-caption text-text-secondary">
          Проверено юристом-партнёром, {formatDate(card.verifiedDate)}
        </span>
      </div>

      <Card className="mt-4">
        <p className="text-caption text-text-secondary">Первоисточник</p>
        <a href={card.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block text-body font-semibold text-ink underline underline-offset-4">
          {card.sourceLabel}
        </a>
      </Card>
    </div>
  );
}
