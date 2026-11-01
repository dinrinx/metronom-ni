"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { recommendedTariffId } from "@/lib/tariffs";
import { useAppState } from "@/state/AppStateContext";
import type { BusinessProfile, Campaign } from "@/types";
import { FinalScreen } from "./_components/FinalScreen";
import { IdentificationScreen } from "./_components/IdentificationScreen";
import { PhoneAuthScreen } from "./_components/PhoneAuthScreen";
import { QuickRegisterScreen } from "./_components/QuickRegisterScreen";
import { SigningScreen } from "./_components/SigningScreen";
import { StatusConfirmScreen } from "./_components/StatusConfirmScreen";
import { TariffScreen } from "./_components/TariffScreen";

type Stage = "status" | "register" | "phone" | "identification" | "tariff" | "signing" | "final";

export default function OnboardingPage() {
  const router = useRouter();
  const { dispatch, activeProfile } = useAppState();
  const [stage, setStage] = useState<Stage>("status");
  const [legalForm, setLegalForm] = useState<BusinessProfile["legalForm"]>(activeProfile.legalForm);
  const recommendedId = recommendedTariffId(activeProfile.sandboxResult?.risk);
  const [tariffId, setTariffId] = useState(recommendedId);

  function finishOnboarding() {
    dispatch({ type: "UPDATE_ACTIVE_PROFILE", patch: { legalForm } });

    const amount = activeProfile.sandboxResult?.recommendedAmount ?? 100000;
    const campaign: Campaign = {
      id: `${activeProfile.id}-first-${Date.now()}`,
      type: "first",
      title: `Старт для «${activeProfile.industryLabel}»`,
      goal: "Запуск бизнеса по расчёту из песочницы",
      goalAmount: amount,
      raisedPercent: 0,
      supportersCount: 0,
      donors: [],
      bonuses: ["Скидка донатерам на первые услуги", "Ранний доступ"],
      status: "активна",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    dispatch({ type: "ADD_CAMPAIGN", campaign });
    dispatch({ type: "COMPLETE_ONBOARDING" });
    setStage("final");
  }

  return (
    <div className="flex justify-center bg-surface md:h-full">
      <div className="w-full max-w-md bg-white md:h-full">
        {stage === "status" && (
          <StatusConfirmScreen
            legalForm={legalForm}
            onChangeForm={setLegalForm}
            onConfirm={() => setStage("phone")}
            onNotRegistered={() => setStage("register")}
          />
        )}

        {stage === "register" && <QuickRegisterScreen onDone={() => setStage("phone")} />}

        {stage === "phone" && <PhoneAuthScreen onDone={() => setStage("identification")} />}

        {stage === "identification" && <IdentificationScreen onSelect={() => setStage("tariff")} />}

        {stage === "tariff" && (
          <TariffScreen
            recommendedId={recommendedId}
            selectedId={tariffId}
            onSelect={setTariffId}
            onNext={() => setStage("signing")}
          />
        )}

        {stage === "signing" && <SigningScreen onSign={finishOnboarding} />}

        {stage === "final" && <FinalScreen profile={activeProfile} onProceed={() => router.push("/dashboard")} />}
      </div>
    </div>
  );
}
