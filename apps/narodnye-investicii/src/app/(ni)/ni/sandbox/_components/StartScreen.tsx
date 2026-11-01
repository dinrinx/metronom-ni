import { Button } from "@/components/ui/Button";
import { AbacusAnimation } from "./AbacusAnimation";

export function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex min-h-screen md:min-h-0 md:h-full flex-col justify-between px-6 py-10">
      <div className="flex flex-1 flex-col justify-center">
        <AbacusAnimation />
        <h1 className="text-h1 text-ink">Привет! Расскажи о своей идее — посчитаем вместе</h1>
        <p className="mt-4 text-body text-text-secondary">
          Пара вопросов о нише и цифрах — и мы покажем, сколько нужно денег на старт и стоит ли рисковать.
        </p>
      </div>
      <Button fullWidth onClick={onStart}>
        Начать
      </Button>
    </div>
  );
}
