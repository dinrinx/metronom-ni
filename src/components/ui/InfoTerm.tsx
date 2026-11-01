"use client";

import { useEffect, useRef, useState } from "react";

export function InfoTerm({ term, definition }: { term: string; definition: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <span ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="cursor-pointer bg-transparent p-0 text-inherit underline decoration-dotted decoration-2 underline-offset-4"
      >
        {term}
      </button>
      {open && (
        <span className="absolute bottom-full left-1/2 z-30 mb-2 w-52 -translate-x-1/2 rounded-lg bg-ink px-3 py-2 text-left text-caption font-normal normal-case leading-snug text-white shadow-lg">
          {definition}
          <span className="absolute left-1/2 top-full -mt-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-ink" />
        </span>
      )}
    </span>
  );
}
