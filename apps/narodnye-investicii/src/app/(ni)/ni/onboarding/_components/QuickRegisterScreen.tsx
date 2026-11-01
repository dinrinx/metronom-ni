import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function QuickRegisterScreen({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [activity, setActivity] = useState("");

  return (
    <div className="flex min-h-screen md:min-h-0 md:h-full flex-col px-6 py-8">
      <h1 className="text-h1 text-ink">Быстрая регистрация</h1>
      <p className="mt-3 text-body text-text-secondary">Заполним статус самозанятого за тебя — это займёт минуту.</p>

      <div className="mt-6 flex flex-col gap-4">
        <Input placeholder="Имя и фамилия" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Вид деятельности" value={activity} onChange={(e) => setActivity(e.target.value)} />
      </div>

      <div className="mt-auto pt-8">
        <Button fullWidth disabled={!name.trim() || !activity.trim()} onClick={onDone}>
          Оформить статус
        </Button>
      </div>
    </div>
  );
}
