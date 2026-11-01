import type { RiskLevel, SandboxInputs, SandboxResult } from "@/types";

function num(value: string): number {
  const n = Number(value.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function computeSandboxResult(inputs: SandboxInputs): SandboxResult {
  const revenue = num(inputs.revenue);
  const expenses = num(inputs.expenses);
  const avgCheck = num(inputs.avgCheck);
  const clients = num(inputs.clients);

  const monthlyProfit = revenue - expenses;
  const capital = Math.round(expenses * 2 + avgCheck * clients * 0.5);

  const effectiveMonthlyProfit = Math.max(monthlyProfit * 0.45, 1);
  const paybackMonths = Math.min(60, Math.ceil(capital / effectiveMonthlyProfit));

  const margin = revenue > 0 ? monthlyProfit / revenue : -1;
  let risk: RiskLevel;
  if (monthlyProfit <= 0 || margin < 0.15) risk = "high";
  else if (margin < 0.35) risk = "medium";
  else risk = "low";

  const recommendedAmount = Math.round((capital * 0.26) / 10000) * 10000;

  return { capital, paybackMonths, risk, recommendedAmount };
}
