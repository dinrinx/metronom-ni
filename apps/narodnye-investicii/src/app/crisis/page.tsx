"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppState } from "@/state/AppStateContext";
import type { Campaign } from "@/types";
import { AltCreditUnlockScreen } from "./_components/AltCreditUnlockScreen";
import { ClosureScreen } from "./_components/ClosureScreen";
import { DonorMonitorScreen, type CrisisOutcome } from "./_components/DonorMonitorScreen";
import { NoticeScreen } from "./_components/NoticeScreen";
import { OverdraftConfirmedScreen } from "./_components/OverdraftConfirmedScreen";
import { OverdraftOfferScreen } from "./_components/OverdraftOfferScreen";
import { PastReportScreen } from "./_components/PastReportScreen";
import { PreviewScreen } from "./_components/PreviewScreen";
import { StrategyFormScreen, type StrategyAnswers } from "./_components/StrategyFormScreen";
import { SuccessScreen } from "./_components/SuccessScreen";
import { TransitionNoticeScreen } from "./_components/TransitionNoticeScreen";
import { WhatIsSavedScreen } from "./_components/WhatIsSavedScreen";

type Stage =
  | "notice"
  | "past-report"
  | "strategy"
  | "preview"
  | "monitor"
  | "success-plan"
  | "alt-credit"
  | "transition"
  | "overdraft-offer"
  | "overdraft-confirmed"
  | "closure"
  | "what-saved";

const EMPTY_ANSWERS: StrategyAnswers = { whatHappened: "", mistakes: "", changed: "", amount: "", amountFor: "" };

export default function CrisisPage() {
  const router = useRouter();
  const { dispatch, activeProfile } = useAppState();
  const [stage, setStage] = useState<Stage>("notice");
  const [strategyStep, setStrategyStep] = useState(0);
  const [answers, setAnswers] = useState<StrategyAnswers>(EMPTY_ANSWERS);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<CrisisOutcome | null>(null);

  const pastCampaign = activeProfile.campaigns.find((c) => c.type === "first");
  const overdraftLimit = Math.max(50000, Math.round((activeProfile.accountBalance * 0.4) / 10000) * 10000);

  function publishCrisisCampaign() {
    const amount = Number(answers.amount.replace(/\s/g, "")) || 0;
    const campaign: Campaign = {
      id: `${activeProfile.id}-crisis-${Date.now()}`,
      type: "crisis",
      title: answers.amountFor,
      goal: answers.whatHappened,
      goalAmount: amount,
      raisedPercent: 54,
      supportersCount: Math.max(1, Math.round(activeProfile.campaigns.reduce((n, c) => n + c.supportersCount, 0) / 2)),
      donors: [],
      bonuses: [],
      status: "активна",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    dispatch({ type: "ADD_CAMPAIGN", campaign });
    setCampaignId(campaign.id);
    setStage("monitor");
  }

  function handleOutcome(chosen: CrisisOutcome) {
    setOutcome(chosen);
    if (chosen === "success") {
      if (campaignId) dispatch({ type: "UPDATE_CAMPAIGN", id: campaignId, patch: { status: "реализовано", raisedPercent: 100 } });
      setStage("success-plan");
    } else {
      setStage("transition");
    }
  }

  function acceptOverdraft() {
    dispatch({
      type: "UPDATE_ACTIVE_PROFILE",
      patch: { hasOverdraft: true, accountBalance: activeProfile.accountBalance + overdraftLimit },
    });
    if (campaignId) dispatch({ type: "UPDATE_CAMPAIGN", id: campaignId, patch: { status: "не хватило" } });
    if (outcome === "overdraft") {
      setStage("overdraft-confirmed");
    } else {
      setStage("closure");
    }
  }

  function finalizeClosure() {
    if (campaignId) dispatch({ type: "UPDATE_CAMPAIGN", id: campaignId, patch: { status: "закрыта" } });
    dispatch({ type: "UPDATE_ACTIVE_PROFILE", patch: { legalStatusLabel: "Закрыт" } });
    setStage("what-saved");
  }

  return (
    <div className="flex justify-center bg-surface">
      <div className="w-full max-w-md bg-white">
        {stage === "notice" && <NoticeScreen onNext={() => setStage("past-report")} />}

        {stage === "past-report" && (
          <PastReportScreen
            pastCampaign={pastCampaign}
            onBack={() => setStage("notice")}
            onNext={() => setStage("strategy")}
          />
        )}

        {stage === "strategy" && (
          <StrategyFormScreen
            step={strategyStep}
            answers={answers}
            onChange={(patch) => setAnswers((prev) => ({ ...prev, ...patch }))}
            onBack={() => (strategyStep === 0 ? setStage("past-report") : setStrategyStep((s) => s - 1))}
            onNext={() => (strategyStep < 3 ? setStrategyStep((s) => s + 1) : setStage("preview"))}
          />
        )}

        {stage === "preview" && (
          <PreviewScreen answers={answers} onBack={() => setStage("strategy")} onPublish={publishCrisisCampaign} />
        )}

        {stage === "monitor" && (
          <DonorMonitorScreen profile={activeProfile} answers={answers} raisedPercent={54} onChooseOutcome={handleOutcome} />
        )}

        {stage === "success-plan" && <SuccessScreen onNext={() => setStage("alt-credit")} />}

        {stage === "alt-credit" && (
          <AltCreditUnlockScreen
            onDone={() => {
              dispatch({ type: "UPDATE_ACTIVE_PROFILE", patch: { altCreditUnlocked: true } });
              router.push("/storefront");
            }}
          />
        )}

        {stage === "transition" && <TransitionNoticeScreen onNext={() => setStage("overdraft-offer")} />}

        {stage === "overdraft-offer" && (
          <OverdraftOfferScreen limit={overdraftLimit} onBack={() => setStage("monitor")} onAccept={acceptOverdraft} />
        )}

        {stage === "overdraft-confirmed" && (
          <OverdraftConfirmedScreen amount={overdraftLimit} onDone={() => router.push("/dashboard")} />
        )}

        {stage === "closure" && <ClosureScreen onNext={finalizeClosure} />}

        {stage === "what-saved" && <WhatIsSavedScreen onRestart={() => router.push("/sandbox")} />}
      </div>
    </div>
  );
}
