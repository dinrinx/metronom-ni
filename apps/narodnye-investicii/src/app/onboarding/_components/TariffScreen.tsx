import { Button } from "@/components/ui/Button";
import { TARIFFS } from "@/lib/tariffs";

interface Props {
  recommendedId: string;
  selectedId: string;
  onSelect: (id: string) => void;
  onNext: () => void;
}

export function TariffScreen({ recommendedId, selectedId, onSelect, onNext }: Props) {
  return (
    <div className="flex min-h-screen md:min-h-0 md:h-full flex-col px-6 py-8">
      <h1 className="text-h1 text-ink">Выбери тариф РКО</h1>
      <p className="mt-3 text-body text-text-secondary">Подобрали вариант по данным из твоей песочницы.</p>

      <div className="mt-6 flex flex-col gap-3">
        {TARIFFS.map((tariff) => {
          const isSelected = tariff.id === selectedId;
          const isRecommended = tariff.id === recommendedId;
          return (
            <button
              key={tariff.id}
              onClick={() => onSelect(tariff.id)}
              className={`rounded-lg border p-4 text-left ${
                isSelected ? "border-ink bg-surface" : "border-border-default bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-card-title text-ink">{tariff.name}</p>
                {isRecommended && (
                  <span className="rounded-full bg-red px-2 py-0.5 text-[11px] font-semibold text-white">
                    Рекомендуем
                  </span>
                )}
              </div>
              <p className="mt-1 text-body font-semibold text-ink">{tariff.price}</p>
              <ul className="mt-2 flex flex-col gap-1">
                {tariff.features.map((f) => (
                  <li key={f} className="text-caption text-text-secondary">
                    · {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-8">
        <Button fullWidth onClick={onNext}>
          Продолжить
        </Button>
      </div>
    </div>
  );
}
