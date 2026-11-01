import { Button } from "@/components/ui/Button";

export function ClosureScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col px-6 py-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-surface text-2xl">🗂️</div>
      <h1 className="mt-4 text-h1 text-ink">Овердрафта не хватает, чтобы закрыть разрыв</h1>
      <p className="mt-3 text-body text-text-secondary">
        В этот раз бизнес не вытянуть. Это не провал лично твой — рынок и обстоятельства тоже часть уравнения.
        Закроем счёт аккуратно и сохраним всё, что ты наработал(а).
      </p>
      <div className="mt-8">
        <Button fullWidth onClick={onNext}>
          Что будет сохранено
        </Button>
      </div>
    </div>
  );
}
