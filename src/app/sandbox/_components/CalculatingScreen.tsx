import { useEffect } from "react";

export function CalculatingScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="flex min-h-screen md:min-h-0 md:h-full flex-col items-center justify-center px-6 py-10 text-center">
      <div
        className="h-16 w-16 animate-spin rounded-full border-[3px] border-border-default"
        style={{ borderTopColor: "var(--red-500)" }}
      />
      <div className="mt-6 flex items-center gap-1 text-h2 text-ink">
        <span>Считаем</span>
        <span className="flex gap-0.5">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink [animation-delay:300ms]" />
        </span>
      </div>
      <p className="mt-2 text-caption text-text-secondary">AI сверяет твои цифры со средними по нише</p>
    </div>
  );
}
