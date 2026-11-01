"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import type { LegalCard } from "@/lib/legalCards";

export function LegalContextPopup({ card }: { card: LegalCard }) {
  const storageKey = `legal-popup-dismissed-${card.id}`;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of localStorage on mount, SSR has no access to it
    if (!localStorage.getItem(storageKey)) setVisible(true);
  }, [storageKey]);

  function dismiss() {
    localStorage.setItem(storageKey, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <BottomSheet onDismiss={dismiss}>
      <p className="text-caption font-semibold uppercase text-red">{card.category} · важно</p>
      <p className="mt-2 text-card-title text-ink">{card.question}</p>
      <p className="mt-2 text-body text-text-secondary">{card.answer}</p>
      <div className="mt-4 flex gap-2">
        <Link href={`/legal?card=${card.id}`} className="flex-1" onClick={dismiss}>
          <Button fullWidth variant="secondary">
            Подробнее
          </Button>
        </Link>
        <Button variant="primary" onClick={dismiss}>
          Понятно
        </Button>
      </div>
    </BottomSheet>
  );
}
