import { Button } from "@/components/ui/Button";

export function NoticeScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col px-6 py-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-surface text-2xl">📉</div>
      <h1 className="mt-4 text-h1 text-ink">Фонда стабильности не хватает</h1>
      <p className="mt-3 text-body text-text-secondary">
        Резерв почти исчерпан, а по текущим оборотам возможен кассовый разрыв. Такое случается — у нас есть план,
        как пройти этот этап вместе.
      </p>
      <div className="mt-8">
        <Button fullWidth onClick={onNext}>
          Разобраться, что делать
        </Button>
      </div>
    </div>
  );
}
