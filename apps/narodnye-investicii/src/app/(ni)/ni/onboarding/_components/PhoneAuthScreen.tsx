import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CodeCells } from "@/components/ui/CodeCells";
import { Input } from "@/components/ui/Input";

type Phase = "phone" | "sms" | "pin";

export function PhoneAuthScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("phone");
  const [phone, setPhone] = useState("");
  const [sms, setSms] = useState("");
  const [pin, setPin] = useState("");

  if (phase === "phone") {
    return (
      <div className="flex min-h-screen md:min-h-0 md:h-full flex-col px-6 py-8">
        <h1 className="text-h1 text-ink">Твой номер телефона</h1>
        <p className="mt-3 text-body text-text-secondary">Пришлём код подтверждения по SMS.</p>
        <div className="mt-6">
          <Input
            autoFocus
            inputMode="tel"
            placeholder="+7 900 000-00-00"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="mt-auto pt-8">
          <Button fullWidth disabled={phone.trim().length < 10} onClick={() => setPhase("sms")}>
            Получить код
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "sms") {
    return (
      <div className="flex min-h-screen md:min-h-0 md:h-full flex-col px-6 py-8">
        <h1 className="text-h1 text-ink">Введи код из SMS</h1>
        <p className="mt-3 text-body text-text-secondary">Отправили на {phone || "твой номер"}</p>
        <div className="mt-10">
          <CodeCells length={4} value={sms} onChange={setSms} />
        </div>
        <div className="mt-auto pt-8">
          <Button fullWidth disabled={sms.length < 4} onClick={() => setPhase("pin")}>
            Подтвердить
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen md:min-h-0 md:h-full flex-col px-6 py-8">
      <h1 className="text-h1 text-ink">Придумай PIN-код</h1>
      <p className="mt-3 text-body text-text-secondary">Он понадобится для входа в приложение</p>
      <div className="mt-10">
        <CodeCells length={4} value={pin} onChange={setPin} secret />
      </div>
      <div className="mt-auto pt-8">
        <Button fullWidth disabled={pin.length < 4} onClick={onDone}>
          Готово
        </Button>
      </div>
    </div>
  );
}
