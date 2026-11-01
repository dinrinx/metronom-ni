import type { BusinessProfile, IndustryId } from "@/types";

export interface WalletSplit {
  revenue: number;
  taxes: number;
  reserve: number;
  purchases: number;
}

export function computeWalletSplit(profile: BusinessProfile): WalletSplit {
  const hasReserve = profile.stabilityFund > 0;
  const taxes = profile.legalForm === "ИП" ? 12 : 6;
  const reserve = hasReserve ? 18 : 8;
  const purchases = 35;
  const revenue = 100 - taxes - reserve - purchases;
  return { revenue, taxes, reserve, purchases };
}

export const INDUSTRY_BENCHMARK_MARGIN: Record<IndustryId, number> = {
  beauty: 28,
  horeca: 18,
  retail: 24,
};

export function computeUserMargin(profile: BusinessProfile): number | null {
  if (!profile.sandboxInputs) return null;
  const revenue = Number(profile.sandboxInputs.revenue) || 0;
  const expenses = Number(profile.sandboxInputs.expenses) || 0;
  if (revenue <= 0) return null;
  return Math.round(((revenue - expenses) / revenue) * 100);
}
