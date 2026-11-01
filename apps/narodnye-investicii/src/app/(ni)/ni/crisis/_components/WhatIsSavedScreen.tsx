import { Button } from "@/components/ui/Button";

const SAVED = [
  { title: "Рейтинг доверия зафиксирован", body: "Уровень не обнуляется — ты начнёшь следующий проект не с нуля" },
  { title: "История доступна", body: "Все сборы, платежи и отзывы донатеров остаются в профиле" },
  { title: "Новый проект — не с чистого листа", body: "Донатеры, которые тебе доверяли, увидят новую идею первыми" },
];

export function WhatIsSavedScreen({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="flex flex-col px-6 py-8">
      <h1 className="text-h1 text-ink">Что сохраняется</h1>
      <div className="mt-4 flex flex-col gap-3">
        {SAVED.map((item) => (
          <div key={item.title} className="rounded-lg bg-surface p-4">
            <p className="text-body font-semibold text-ink">{item.title}</p>
            <p className="mt-1 text-caption text-text-secondary">{item.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-body text-text-secondary">
        Контур доверия не обрывает отношения даже после закрытия бизнеса — когда будешь готов(а), начнём считать
        следующую идею вместе.
      </p>
      <div className="mt-8">
        <Button fullWidth onClick={onRestart}>
          Начать новую идею
        </Button>
      </div>
    </div>
  );
}
