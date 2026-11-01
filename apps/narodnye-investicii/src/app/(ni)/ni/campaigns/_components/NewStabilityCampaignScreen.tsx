import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface Props {
  onBack: () => void;
  onSubmit: (goal: string, amount: number) => void;
}

export function NewStabilityCampaignScreen({ onBack, onSubmit }: Props) {
  const [goal, setGoal] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div className="flex flex-col px-6 py-8">
      <button onClick={onBack} className="self-start text-2xl leading-none text-ink" aria-label="Назад">
        ‹
      </button>

      <h1 className="mt-4 text-h1 text-ink">Сбор «на устойчивость»</h1>
      <p className="mt-3 text-body text-text-secondary">
        Это не то же самое, что первый сбор. Там ты собирал(а) на конкретный запуск. Здесь — на резерв, который
        подстрахует бизнес в будущем: не под конкретную цель прямо сейчас, а на случай кассового разрыва или
        непредвиденных расходов.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <Input placeholder="На что копим (например, резерв на сезонный спад)" value={goal} onChange={(e) => setGoal(e.target.value)} />
        <Input inputMode="numeric" placeholder="Сумма" suffix="₽" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>

      <div className="mt-8">
        <Button
          fullWidth
          disabled={!goal.trim() || !amount.trim()}
          onClick={() => onSubmit(goal, Number(amount.replace(/\s/g, "")) || 0)}
        >
          Запустить сбор
        </Button>
      </div>
    </div>
  );
}
