import { Button } from "@/components/ui/Button";

export function SuccessScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col px-6 py-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-surface text-2xl">✓</div>
      <h1 className="mt-4 text-h1 text-ink">Бизнес стабилизировался</h1>
      <p className="mt-3 text-body text-text-secondary">
        Сбор закрыт полностью, разрыва не случилось. Вот короткий план на ближайший месяц:
      </p>

      <ul className="mt-4 flex flex-col gap-2">
        {["Держать резерв в Фонде стабильности не ниже месячных расходов", "Раз в неделю сверяться с AI-ассистентом", "Не откладывать следующий сбор «на устойчивость»"].map(
          (item) => (
            <li key={item} className="rounded-lg bg-surface p-3 text-body text-ink">
              {item}
            </li>
          ),
        )}
      </ul>

      <div className="mt-8">
        <Button fullWidth onClick={onNext}>
          Продолжить
        </Button>
      </div>
    </div>
  );
}
