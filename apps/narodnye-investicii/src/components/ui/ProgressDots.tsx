interface ProgressDotsProps {
  total: number;
  current: number;
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${
              i < current ? "bg-ink" : i === current ? "border-2 border-ink bg-white" : "bg-border-default"
            }`}
          />
        ))}
      </div>
      <span className="text-caption text-text-secondary">
        Шаг {current + 1} из {total}
      </span>
    </div>
  );
}
