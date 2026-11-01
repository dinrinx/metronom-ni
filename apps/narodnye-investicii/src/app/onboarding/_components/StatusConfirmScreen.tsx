import { Button } from "@/components/ui/Button";
import type { BusinessProfile } from "@/types";

interface Props {
  legalForm: BusinessProfile["legalForm"];
  onChangeForm: (form: BusinessProfile["legalForm"]) => void;
  onConfirm: () => void;
  onNotRegistered: () => void;
}

export function StatusConfirmScreen({ legalForm, onChangeForm, onConfirm, onNotRegistered }: Props) {
  return (
    <div className="flex min-h-screen md:min-h-0 md:h-full flex-col px-6 py-8">
      <h1 className="text-h1 text-ink">Подтверди статус</h1>
      <p className="mt-3 text-body text-text-secondary">Мы определили твой статус по данным из песочницы.</p>

      <div className="mt-6 flex flex-col gap-3">
        {(["ИП", "Самозанятый"] as const).map((form) => (
          <button
            key={form}
            onClick={() => onChangeForm(form)}
            className={`flex items-center justify-between rounded-lg border p-4 text-left ${
              legalForm === form ? "border-ink bg-surface" : "border-border-default bg-white"
            }`}
          >
            <span className="text-body font-medium text-ink">{form}</span>
            {legalForm === form && <span className="text-body text-ink">✓</span>}
          </button>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Button fullWidth onClick={onConfirm}>
          Всё верно, продолжить
        </Button>
        <Button fullWidth variant="secondary" onClick={onNotRegistered}>
          Ещё не оформлен(а)
        </Button>
      </div>
    </div>
  );
}
