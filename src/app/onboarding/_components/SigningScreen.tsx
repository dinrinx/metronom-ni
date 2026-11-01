import { Button } from "@/components/ui/Button";

const DOCS = [
  "Договор расчётно-кассового обслуживания",
  "Тарифный план",
  "Согласие на обработку персональных данных",
];

export function SigningScreen({ onSign }: { onSign: () => void }) {
  return (
    <div className="flex min-h-screen md:min-h-0 md:h-full flex-col px-6 py-8">
      <h1 className="text-h1 text-ink">Осталось подписать</h1>
      <p className="mt-3 text-body text-text-secondary">Проверь документы — подпись потребуется только один раз.</p>

      <div className="mt-6 flex flex-col gap-3">
        {DOCS.map((doc) => (
          <div key={doc} className="flex items-center gap-3 rounded-lg bg-surface p-4">
            <span className="text-lg">📄</span>
            <span className="text-body text-ink">{doc}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-8">
        <Button fullWidth onClick={onSign}>
          Подписать
        </Button>
      </div>
    </div>
  );
}
