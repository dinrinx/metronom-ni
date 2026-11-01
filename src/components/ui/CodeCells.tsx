"use client";

import { useRef } from "react";

interface CodeCellsProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  secret?: boolean;
}

export function CodeCells({ length, value, onChange, secret }: CodeCellsProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function setDigit(index: number, digit: string) {
    const clean = digit.replace(/\D/g, "").slice(-1);
    const chars = value.split("");
    chars[index] = clean;
    const next = chars.join("").slice(0, length);
    onChange(next);
    if (clean && index < length - 1) refs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  }

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={value[i] ? (secret ? "•" : value[i]) : ""}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          inputMode="numeric"
          maxLength={1}
          className="h-14 w-12 rounded-md bg-surface text-center text-h2 text-ink outline-none focus:ring-2 focus:ring-ink"
        />
      ))}
    </div>
  );
}
