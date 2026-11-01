import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { formatRub } from "@/lib/format";
import type { BusinessProfile } from "@/types";
import type { StrategyAnswers } from "./StrategyFormScreen";

type Tab = "donor" | "monitor";
export type CrisisOutcome = "success" | "overdraft" | "closure";

interface Props {
  profile: BusinessProfile;
  answers: StrategyAnswers;
  raisedPercent: number;
  onChooseOutcome: (outcome: CrisisOutcome) => void;
}

export function DonorMonitorScreen({ profile, answers, raisedPercent, onChooseOutcome }: Props) {
  const [tab, setTab] = useState<Tab>("donor");
  const amount = Number(answers.amount.replace(/\s/g, "")) || 0;
  const raised = Math.round((amount * raisedPercent) / 100);
  const pastDonors = profile.campaigns.flatMap((c) => c.donors).slice(0, 3);

  return (
    <div className="flex flex-col px-6 py-8">
      <h1 className="text-h1 text-ink">Сбор опубликован</h1>

      <div className="mt-4 flex gap-1 rounded-md bg-surface p-1">
        <button
          onClick={() => setTab("donor")}
          className={`flex-1 rounded-sm py-2 text-caption font-medium ${tab === "donor" ? "bg-ink text-white" : "text-text-secondary"}`}
        >
          Глазами донатеров
        </button>
        <button
          onClick={() => setTab("monitor")}
          className={`flex-1 rounded-sm py-2 text-caption font-medium ${tab === "monitor" ? "bg-ink text-white" : "text-text-secondary"}`}
        >
          Мониторинг
        </button>
      </div>

      {tab === "donor" && (
        <div className="mt-4">
          <Card>
            <span className="text-caption font-semibold uppercase text-red">Пересматриваю стратегию</span>
            <p className="mt-2 text-card-title text-ink">{answers.amountFor}</p>
            <p className="mt-2 text-body text-text-secondary">{answers.whatHappened}</p>
          </Card>

          <p className="mt-4 text-caption font-semibold uppercase text-text-secondary">Комментарии</p>
          <div className="mt-2 flex flex-col gap-2">
            {pastDonors.length === 0 && <p className="text-body text-text-secondary">Пока нет комментариев</p>}
            {pastDonors.map((d, i) => (
              <div key={i} className="rounded-lg bg-surface p-3">
                <p className="text-caption font-semibold text-ink">{d.name}</p>
                <p className="mt-1 text-body text-text-secondary">
                  Уже поддерживал(а) в прошлый раз — верю, что получится и сейчас 🤝
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "monitor" && (
        <div className="mt-4">
          <Card inverse>
            <p className="text-caption uppercase text-white/70">Собрано сейчас</p>
            <p className="mt-1 text-[26px] font-bold">{formatRub(raised)}</p>
            <p className="mt-1 text-caption text-white/70">
              из {formatRub(amount)} · {raisedPercent}% · обновляется в реальном времени
            </p>
          </Card>

          <p className="mt-6 text-caption font-semibold uppercase text-text-secondary">Демо: выбери исход сбора</p>
          <div className="mt-2 flex flex-col gap-2">
            <button
              onClick={() => onChooseOutcome("success")}
              className="rounded-lg border border-border-default bg-white p-3 text-left text-body text-ink"
            >
              Сбор набрал сумму полностью
            </button>
            <button
              onClick={() => onChooseOutcome("overdraft")}
              className="rounded-lg border border-border-default bg-white p-3 text-left text-body text-ink"
            >
              Не хватило — оформить овердрафт
            </button>
            <button
              onClick={() => onChooseOutcome("closure")}
              className="rounded-lg border border-border-default bg-white p-3 text-left text-body text-ink"
            >
              Не хватило — овердрафт не покрывает
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
