"use client";

import { useAppState } from "@/state/AppStateContext";
import type { IndustryId } from "@/types";

const OPTIONS: { id: IndustryId; label: string }[] = [
  { id: "beauty", label: "Бьюти" },
  { id: "horeca", label: "HoReCa" },
  { id: "retail", label: "Розница" },
];

export function ProfileSwitcher() {
  const { state, dispatch } = useAppState();

  return (
    <div className="flex gap-1 rounded-md bg-surface p-1">
      {OPTIONS.map((opt) => {
        const active = state.activeProfileId === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => dispatch({ type: "SWITCH_PROFILE", id: opt.id })}
            className={`rounded-sm px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
              active ? "bg-ink text-white" : "text-text-secondary"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
