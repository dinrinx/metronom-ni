import { Button } from "@/components/ui/Button";
import { TrustRatingRing } from "@/components/ui/TrustRatingRing";

const PRODUCTS = ["Кредит", "Лизинг", "Факторинг", "Страхование"];

export function AltCreditUnlockScreen({ onDone }: { onDone: () => void }) {
  return (
    <div className="flex flex-col items-center px-6 py-8 text-center">
      <p className="text-caption font-semibold uppercase text-red">Новый уровень</p>
      <h1 className="mt-2 text-h1 text-ink">Альтернативная кредитная история разблокирована</h1>
      <p className="mt-2 text-body text-text-secondary">
        Ты прошёл(ла) кризисный цикл и удержал(а) обязательства — это тоже кредитная история.
      </p>

      <div className="mt-6">
        <TrustRatingRing percent={100} level="Надёжный партнёр" nextLevel="максимум" />
      </div>

      <div className="mt-6 w-full">
        <p className="text-left text-caption font-semibold uppercase text-text-secondary">Стало доступно</p>
        <div className="mt-2 flex flex-col gap-2">
          {PRODUCTS.map((p) => (
            <div key={p} className="flex items-center justify-between rounded-lg bg-surface p-3 text-left">
              <span className="text-body font-medium text-ink">{p}</span>
              <span className="text-caption text-text-secondary">благодаря накопленной истории</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 w-full">
        <Button fullWidth onClick={onDone}>
          Открыть витрину продуктов
        </Button>
      </div>
    </div>
  );
}
