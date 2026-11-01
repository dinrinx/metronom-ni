import type { Money, Obligation } from "@/domain/types";

export function calculateTotalCommitted(obligations: Obligation[]): Money {
  return obligations
    .filter((obligation) => obligation.status === "confirmed")
    .reduce((sum, obligation) => sum + obligation.amount, 0);
}

export function calculateSafeToSpend(currentAccountsTotal: Money, committedTotal: Money): Money {
  return Math.max(0, currentAccountsTotal - committedTotal);
}
