import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatRub } from "@/lib/format";
import type { StrategyAnswers } from "./StrategyFormScreen";

export function PreviewScreen({
  answers,
  onPublish,
  onBack,
}: {
  answers: StrategyAnswers;
  onPublish: () => void;
  onBack: () => void;
}) {
  const amount = Number(answers.amount.replace(/\s/g, "")) || 0;

  return (
    <div className="flex flex-col px-6 py-8">
      <button onClick={onBack} className="self-start text-2xl leading-none text-ink" aria-label="Назад">
        ‹
      </button>
      <h1 className="mt-4 text-h1 text-ink">Предпросмотр перед публикацией</h1>
      <p className="mt-2 text-caption text-text-secondary">Так карточку увидят донатеры</p>

      <Card className="mt-6">
        <span className="text-caption font-semibold uppercase text-red">Пересматриваю стратегию</span>
        <p className="mt-2 text-card-title text-ink">{answers.amountFor}</p>
        <p className="mt-3 text-body text-ink">{answers.whatHappened}</p>
        <p className="mt-2 text-body text-text-secondary">Что изменилось: {answers.changed}</p>
        <div className="mt-4 h-2 rounded-full bg-white">
          <div className="h-2 w-0 rounded-full bg-ink" />
        </div>
        <p className="mt-2 text-caption text-text-secondary">Цель: {formatRub(amount)}</p>
      </Card>

      <div className="mt-8">
        <Button fullWidth onClick={onPublish}>
          Опубликовать сбор
        </Button>
      </div>
    </div>
  );
}
