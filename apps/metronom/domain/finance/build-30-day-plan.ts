import type { CashEvent, Money, Obligation } from "@/domain/types";
import { isoDay } from "@/lib/formatting";

export type DayPlanPoint = {
  date: string;
  openingBalance: Money;
  inflows: Money;
  outflows: Money;
  closingBalance: Money;
};

export type ThirtyDayPlan = {
  days: DayPlanPoint[];
  minimumBalance: Money;
  firstDeficitDate: string | null;
  protectedRiskDates: string[];
};

function addDays(baseIsoDate: string, offset: number): string {
  const base = new Date(`${baseIsoDate}T00:00:00.000Z`);
  base.setUTCDate(base.getUTCDate() + offset);
  return base.toISOString().slice(0, 10);
}

export function build30DayPlan(input: {
  startDate: string;
  openingBalance: Money;
  cashEvents: CashEvent[];
  obligations: Obligation[];
  days?: number;
}): ThirtyDayPlan {
  const horizon = input.days ?? 30;
  const inflowsByDay = new Map<string, Money>();
  const outflowsByDay = new Map<string, Money>();

  for (const event of input.cashEvents) {
    if (event.id === "cash_start") continue;
    const day = isoDay(event.date);
    inflowsByDay.set(day, (inflowsByDay.get(day) ?? 0) + event.amount);
  }

  for (const obligation of input.obligations) {
    if (obligation.status !== "confirmed" || obligation.dueDate === null) continue;
    outflowsByDay.set(
      obligation.dueDate,
      (outflowsByDay.get(obligation.dueDate) ?? 0) + obligation.amount,
    );
  }

  const days: DayPlanPoint[] = [];
  const protectedRiskDates = ["2026-08-19", "2026-08-28"];
  let balance = input.openingBalance;
  let minimumBalance = input.openingBalance;
  let firstDeficitDate: string | null = null;

  for (let index = 0; index < horizon; index += 1) {
    const date = addDays(input.startDate, index);
    const inflows = inflowsByDay.get(date) ?? 0;
    const outflows = outflowsByDay.get(date) ?? 0;
    const openingBalance = balance;
    balance = openingBalance + inflows - outflows;
    minimumBalance = Math.min(minimumBalance, balance);
    if (balance < 0 && firstDeficitDate === null) {
      firstDeficitDate = date;
    }

    days.push({
      date,
      openingBalance,
      inflows,
      outflows,
      closingBalance: balance,
    });
  }

  return {
    days,
    minimumBalance,
    firstDeficitDate,
    protectedRiskDates,
  };
}
