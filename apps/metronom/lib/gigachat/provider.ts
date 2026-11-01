import type { GigachatRequest } from "@/lib/gigachat/schemas";
import { explainDecisionWithGigachat, GigachatError } from "@/lib/gigachat/client";
import { FALLBACK_EXPLANATIONS } from "@/lib/demo/fallback-responses";
import { INDUSTRY_PROFILES } from "@/lib/industry/profiles";

export async function resolveExplanation(input: GigachatRequest) {
  const fallback = FALLBACK_EXPLANATIONS[input.payload.industryProfileId];

  if (input.mode === "mock") {
    return { explanation: fallback, source: "fallback" as const };
  }

  try {
    const profile = INDUSTRY_PROFILES[input.payload.industryProfileId];
    const explanation = await explainDecisionWithGigachat({
      industryLabel: profile.businessLabel,
      safeToSpend: input.payload.safeToSpend,
      committedTotal: input.payload.committedTotal,
      currentAccountsTotal: input.payload.currentAccountsTotal,
      clarificationDate: input.payload.clarificationDate,
    });

    return { explanation, source: "live" as const };
  } catch (error) {
    if (input.mode === "live") {
      throw error;
    }

    if (error instanceof GigachatError) {
      return { explanation: fallback, source: "fallback" as const, errorCode: error.code };
    }

    return { explanation: fallback, source: "fallback" as const, errorCode: "UNKNOWN_GIGACHAT_ERROR" };
  }
}
