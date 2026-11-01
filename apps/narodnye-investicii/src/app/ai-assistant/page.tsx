"use client";

import Link from "next/link";
import { BottomNav } from "@/components/ui/BottomNav";
import { computeUserMargin, computeWalletSplit, INDUSTRY_BENCHMARK_MARGIN } from "@/lib/aiInsights";
import { useAppState } from "@/state/AppStateContext";
import { BenchmarkCard } from "./_components/BenchmarkCard";
import { RiskBanner } from "./_components/RiskBanner";
import { WalletSplitCard } from "./_components/WalletSplitCard";

export default function AiAssistantPage() {
  const { activeProfile } = useAppState();
  const split = computeWalletSplit(activeProfile);
  const userMargin = computeUserMargin(activeProfile);
  const benchmark = INDUSTRY_BENCHMARK_MARGIN[activeProfile.id];

  return (
    <div className="flex justify-center bg-surface">
      <div className="w-full max-w-md bg-white pb-28">
        <div className="px-6 py-6">
          <Link href="/dashboard" className="text-2xl leading-none text-ink" aria-label="Назад">
            ‹
          </Link>
          <h1 className="mt-4 text-h1 text-ink">AI-ассистент</h1>

          <div className="mt-4">
            <RiskBanner daysAway={activeProfile.aiRiskDaysAway} advice={activeProfile.aiRiskAdvice} />
          </div>

          <div className="mt-4">
            <WalletSplitCard split={split} />
          </div>

          {userMargin !== null && (
            <div className="mt-4">
              <BenchmarkCard userMargin={userMargin} benchmark={benchmark} industryLabel={activeProfile.industryLabel} />
            </div>
          )}
        </div>
      </div>
      <BottomNav active="main" />
    </div>
  );
}
