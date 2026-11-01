export function IdentificationScreen({ onSelect }: { onSelect: (method: "video" | "courier") => void }) {
  return (
    <div className="flex min-h-screen md:min-h-0 md:h-full flex-col px-6 py-8">
      <h1 className="text-h1 text-ink">Как подтвердим личность?</h1>
      <p className="mt-3 text-body text-text-secondary">Выбери удобный способ идентификации.</p>

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={() => onSelect("video")}
          className="rounded-lg border border-border-default bg-white p-4 text-left"
        >
          <p className="text-body font-semibold text-ink">Видеозвонок с оператором</p>
          <p className="mt-1 text-caption text-text-secondary">5 минут, без визита в офис</p>
        </button>
        <button
          onClick={() => onSelect("courier")}
          className="rounded-lg border border-border-default bg-white p-4 text-left"
        >
          <p className="text-body font-semibold text-ink">Курьер привезёт документы</p>
          <p className="mt-1 text-caption text-text-secondary">Подпишешь бумажные копии на месте</p>
        </button>
      </div>
    </div>
  );
}
