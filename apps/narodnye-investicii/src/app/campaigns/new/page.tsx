"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useAppState } from "@/state/AppStateContext";
import type { Campaign, CampaignType } from "@/types";

const TYPES: { id: CampaignType; label: string }[] = [
  { id: "first", label: "Первый сбор" },
  { id: "stability", label: "На устойчивость" },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const { activeProfile, dispatch } = useAppState();
  const [type, setType] = useState<CampaignType>("first");
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [amount, setAmount] = useState("");

  const canSubmit = title.trim().length > 0 && goal.trim().length > 0 && amount.trim().length > 0;

  function handleSubmit() {
    const campaign: Campaign = {
      id: `${activeProfile.id}-${type}-${Date.now()}`,
      type,
      title,
      goal,
      goalAmount: Number(amount.replace(/\s/g, "")) || 0,
      raisedPercent: 0,
      supportersCount: 0,
      donors: [],
      bonuses: [],
      status: "активна",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    dispatch({ type: "ADD_CAMPAIGN", campaign });
    router.push(`/campaigns/${campaign.id}`);
  }

  return (
    <div className="flex justify-center bg-surface">
      <div className="w-full max-w-md bg-white">
        <div className="flex flex-col px-6 py-8">
          <button onClick={() => router.back()} className="self-start text-2xl leading-none text-ink" aria-label="Назад">
            ‹
          </button>
          <h1 className="mt-4 text-h1 text-ink">Новый сбор</h1>

          <div className="mt-6 flex gap-2">
            {TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`rounded-full px-3 py-1.5 text-caption font-medium ${
                  type === t.id ? "bg-ink text-white" : "bg-surface text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <Input placeholder="Название сбора" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea placeholder="На что собираем" value={goal} onChange={(e) => setGoal(e.target.value)} />
            <Input
              inputMode="numeric"
              placeholder="Сумма"
              suffix="₽"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="mt-8">
            <Button fullWidth disabled={!canSubmit} onClick={handleSubmit}>
              Опубликовать сбор
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
