"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { BottomNav } from "@/components/ui/BottomNav";
import { useAppState } from "@/state/AppStateContext";
import type { Campaign } from "@/types";
import { CampaignListScreen } from "./_components/CampaignListScreen";
import { CompensationScreen } from "./_components/CompensationScreen";
import { NewStabilityCampaignScreen } from "./_components/NewStabilityCampaignScreen";
import { PaymentConfirmScreen } from "./_components/PaymentConfirmScreen";
import { StabilityFundScreen } from "./_components/StabilityFundScreen";

type View = "list" | "payment" | "compensation" | "fund" | "new-stability";

function CampaignsPageInner() {
  const searchParams = useSearchParams();
  const initialView = searchParams.get("view") === "fund" ? "fund" : "list";
  const { dispatch, activeProfile } = useAppState();
  const [view, setView] = useState<View>(initialView);

  function handleNewStability(goal: string, amount: number) {
    const campaign: Campaign = {
      id: `${activeProfile.id}-stability-${Date.now()}`,
      type: "stability",
      title: goal,
      goal: "Резерв на будущее, не текущая цель",
      goalAmount: amount,
      raisedPercent: 0,
      supportersCount: 0,
      donors: [],
      bonuses: [],
      status: "активна",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    dispatch({ type: "ADD_CAMPAIGN", campaign });
    setView("list");
  }

  return (
    <div className="flex justify-center bg-surface md:h-full">
      <div className="w-full max-w-md bg-white pb-28">
        {view === "list" && (
          <CampaignListScreen
            profile={activeProfile}
            onOpenLastPayment={() => setView("payment")}
            onOpenFund={() => setView("fund")}
            onNewStability={() => setView("new-stability")}
          />
        )}

        {view === "payment" && (
          <PaymentConfirmScreen
            transaction={activeProfile.lastTransaction}
            onBack={() => setView("list")}
            onNext={() => setView("compensation")}
          />
        )}

        {view === "compensation" && (
          <CompensationScreen
            transaction={activeProfile.lastTransaction}
            onBack={() => setView("payment")}
            onDone={() => setView("list")}
          />
        )}

        {view === "fund" && (
          <StabilityFundScreen
            amount={activeProfile.stabilityFund}
            history={activeProfile.stabilityFundHistory}
            onBack={() => setView("list")}
          />
        )}

        {view === "new-stability" && (
          <NewStabilityCampaignScreen onBack={() => setView("list")} onSubmit={handleNewStability} />
        )}
      </div>
      <BottomNav active="payments" />
    </div>
  );
}

export default function CampaignsPage() {
  return (
    <Suspense fallback={null}>
      <CampaignsPageInner />
    </Suspense>
  );
}
