"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { OverdraftConfirmedScreen } from "@/app/crisis/_components/OverdraftConfirmedScreen";
import { OverdraftOfferScreen } from "@/app/crisis/_components/OverdraftOfferScreen";
import { SuccessScreen } from "@/app/crisis/_components/SuccessScreen";
import { formatDate, formatRub } from "@/lib/format";
import { useAppState } from "@/state/AppStateContext";

const TYPE_LABEL: Record<string, string> = {
  first: "Первый сбор",
  stability: "На устойчивость",
  crisis: "Пересматриваю стратегию",
};

type Stage = "detail" | "success" | "overdraft-offer" | "overdraft-confirmed";

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { activeProfile, dispatch } = useAppState();
  const [stage, setStage] = useState<Stage>("detail");

  const campaign = activeProfile.campaigns.find((c) => c.id === params.id);
  const overdraftLimit = Math.max(50000, Math.round((activeProfile.accountBalance * 0.4) / 10000) * 10000);

  if (!campaign) {
    return (
      <div className="flex justify-center bg-surface">
        <div className="flex w-full max-w-md flex-col items-center bg-white px-6 py-16 text-center">
          <p className="text-body text-text-secondary">Сбор не найден в этом профиле</p>
          <Link href="/campaigns" className="mt-4 text-body font-semibold text-ink underline underline-offset-4">
            К списку сборов
          </Link>
        </div>
      </div>
    );
  }

  function markSuccess() {
    dispatch({ type: "UPDATE_CAMPAIGN", id: campaign!.id, patch: { status: "реализовано", raisedPercent: 100 } });
    setStage("success");
  }

  function acceptOverdraft() {
    dispatch({
      type: "UPDATE_ACTIVE_PROFILE",
      patch: { hasOverdraft: true, accountBalance: activeProfile.accountBalance + overdraftLimit },
    });
    dispatch({ type: "UPDATE_CAMPAIGN", id: campaign!.id, patch: { status: "не хватило" } });
    setStage("overdraft-confirmed");
  }

  if (stage === "success") {
    return (
      <div className="flex justify-center bg-surface">
        <div className="w-full max-w-md bg-white">
          <SuccessScreen onNext={() => router.push("/campaigns")} />
        </div>
      </div>
    );
  }

  if (stage === "overdraft-offer") {
    return (
      <div className="flex justify-center bg-surface">
        <div className="w-full max-w-md bg-white">
          <OverdraftOfferScreen limit={overdraftLimit} onAccept={acceptOverdraft} onBack={() => setStage("detail")} />
        </div>
      </div>
    );
  }

  if (stage === "overdraft-confirmed") {
    return (
      <div className="flex justify-center bg-surface">
        <div className="w-full max-w-md bg-white">
          <OverdraftConfirmedScreen amount={overdraftLimit} onDone={() => router.push("/dashboard")} />
        </div>
      </div>
    );
  }

  const raised = Math.round((campaign.goalAmount * campaign.raisedPercent) / 100);
  const barPercent = Math.min(100, campaign.raisedPercent);
  const canClose = campaign.status === "активна";

  return (
    <div className="flex justify-center bg-surface">
      <div className="w-full max-w-md bg-white pb-10">
        <div className="px-6 py-6">
          <Link href="/campaigns" className="text-2xl leading-none text-ink" aria-label="Назад">
            ‹
          </Link>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-caption font-semibold uppercase text-red">{TYPE_LABEL[campaign.type]}</span>
            <span className="text-caption text-text-secondary">{campaign.status}</span>
          </div>
          <h1 className="mt-2 text-h1 text-ink">{campaign.title}</h1>
          <p className="mt-2 text-body text-text-secondary">{campaign.goal}</p>

          <Card className="mt-4">
            <div className="h-2 rounded-full bg-white">
              <div className="h-2 rounded-full bg-ink" style={{ width: `${barPercent}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-caption text-text-secondary">
              <span>
                {formatRub(raised)} из {formatRub(campaign.goalAmount)}
              </span>
              <span>{campaign.raisedPercent}%</span>
            </div>
            <p className="mt-3 text-caption text-text-secondary">
              {campaign.supportersCount} поддержавших · создан {formatDate(campaign.createdAt)}
            </p>
            {campaign.bonuses.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {campaign.bonuses.map((b) => (
                  <span key={b} className="rounded-full bg-white px-2.5 py-1 text-[11px] text-ink">
                    {b}
                  </span>
                ))}
              </div>
            )}
          </Card>

          <p className="mt-6 text-caption font-semibold uppercase text-text-secondary">Отзывы</p>
          <div className="mt-2 flex flex-col gap-2">
            {campaign.donors.length === 0 && <p className="text-body text-text-secondary">Пока нет отзывов</p>}
            {campaign.donors.map((donor, i) => (
              <div key={i} className="rounded-lg bg-surface p-3">
                <p className="text-caption font-semibold text-ink">{donor.name}</p>
                <p className="mt-1 text-body text-text-secondary">
                  Поддержал(а) на {formatRub(donor.amount)} — жду результата, удачи со сбором! 🤝
                </p>
              </div>
            ))}
          </div>

          {canClose && (
            <div className="mt-6 flex flex-col gap-2">
              <Button fullWidth onClick={markSuccess}>
                Отметить сбор успешным
              </Button>
              <Button fullWidth variant="secondary" onClick={() => setStage("overdraft-offer")}>
                Не хватило — предложить овердрафт
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
