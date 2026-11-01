import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { LEGAL_CARDS, LEGAL_CATEGORIES, type LegalCard } from "@/lib/legalCards";

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  onOpenCard: (card: LegalCard) => void;
}

export function SearchScreen({ query, onQueryChange, onOpenCard }: Props) {
  const trimmed = query.trim().toLowerCase();
  const results = trimmed
    ? LEGAL_CARDS.filter(
        (c) =>
          c.question.toLowerCase().includes(trimmed) ||
          c.category.toLowerCase().includes(trimmed) ||
          c.keywords.some((k) => k.includes(trimmed)),
      )
    : [];
  const frequent = LEGAL_CARDS.filter((c) => c.frequent);

  return (
    <div className="flex flex-col px-6 py-6">
      <Link href="/dashboard" className="text-2xl leading-none text-ink" aria-label="Назад">
        ‹
      </Link>
      <h1 className="mt-4 text-h1 text-ink">Юридические карточки</h1>
      <div className="mt-4">
        <Input
          autoFocus
          placeholder="Спроси про кассу, лицензию, налоги…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>

      {trimmed.length === 0 && (
        <>
          <div className="mt-5 flex flex-wrap gap-2">
            {LEGAL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => onQueryChange(cat)}
                className="rounded-full bg-surface px-3 py-1.5 text-caption font-medium text-ink"
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="mt-6 text-caption font-semibold uppercase text-text-secondary">Часто спрашивают</p>
          <div className="mt-2 flex flex-col gap-2">
            {frequent.map((c) => (
              <button
                key={c.id}
                onClick={() => onOpenCard(c)}
                className="rounded-lg bg-surface p-4 text-left text-body font-medium text-ink"
              >
                {c.question}
              </button>
            ))}
          </div>
        </>
      )}

      {trimmed.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-caption text-text-secondary">
            Мы подбираем готовый проверенный ответ, а не сочиняем новый
          </p>
          <div className="flex flex-col gap-2">
            {results.length === 0 && <p className="text-body text-text-secondary">Ничего не нашлось по запросу</p>}
            {results.map((c) => (
              <button
                key={c.id}
                onClick={() => onOpenCard(c)}
                className="rounded-lg bg-surface p-4 text-left"
              >
                <span className="text-caption font-semibold uppercase text-red">{c.category}</span>
                <p className="mt-1 text-body font-medium text-ink">{c.question}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
