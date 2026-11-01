import { Button } from "@/components/ui/Button";

export function TransitionNoticeScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col px-6 py-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-surface text-2xl">🧭</div>
      <h1 className="mt-4 text-h1 text-ink">Сбор набрал не всю сумму</h1>
      <p className="mt-3 text-body text-text-secondary">
        Такое бывает, и это не конец. У тебя есть доступ к овердрафту — рассмотрим его как следующий шаг.
      </p>
      <div className="mt-8">
        <Button fullWidth onClick={onNext}>
          Посмотреть условия
        </Button>
      </div>
    </div>
  );
}
