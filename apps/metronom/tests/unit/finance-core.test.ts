import { describe, expect, test } from "vitest";
import { calculateSafeToSpend, calculateTotalCommitted } from "@/domain/finance/calculate-safe-to-spend";
import { build30DayPlan } from "@/domain/finance/build-30-day-plan";
import { authorizeAction } from "@/domain/policy/authorize-action";
import { demoReducer } from "@/domain/events/reducer";
import { createBaseObligations, createCashEvents, createInitialState, PROFILE_FINANCE_FIXTURES } from "@/lib/demo/fixtures";
import { formatMoney, formatRuDate } from "@/lib/formatting";
import { INDUSTRY_PROFILES } from "@/lib/industry/profiles";

describe("financial core", () => {
  test("420 000 - 334 000 = 86 000", () => {
    expect(calculateSafeToSpend(420_000, 334_000)).toBe(86_000);
  });

  test("confirmed obligations sum to 334 000 after user confirms the ambiguous supplier date", () => {
    let state = createInitialState("horeca");
    state = demoReducer(state, { type: "pick_clarification_date", isoDate: "2026-08-18" });
    state = demoReducer(state, { type: "apply_clarification" });

    expect(calculateTotalCommitted(state.obligations)).toBe(334_000);
  });

  test("ambiguous date cannot be treated as confirmed before the user chooses", () => {
    const supplier = createBaseObligations().find((obligation) => obligation.id === "supplier");

    expect(supplier?.status).toBe("ambiguous");
    expect(supplier?.dueDate).toBeNull();
  });

  test("after choosing 18 August 2026, the supplier obligation receives a confirmed date", () => {
    let state = createInitialState("horeca");
    state = demoReducer(state, { type: "pick_clarification_date", isoDate: "2026-08-18" });
    state = demoReducer(state, { type: "apply_clarification" });

    const supplier = state.obligations.find((obligation) => obligation.id === "supplier");
    expect(supplier?.status).toBe("confirmed");
    expect(supplier?.dueDate).toBe("2026-08-18");
  });

  test("logical reserve rule does not create a real transfer", () => {
    let state = createInitialState("horeca");
    state = demoReducer(state, { type: "pick_clarification_date", isoDate: "2026-08-18" });
    state = demoReducer(state, { type: "apply_clarification" });
    state = demoReducer(state, { type: "prepare_reserve_rule" });
    state = demoReducer(state, { type: "save_reserve_format" });

    expect(state.reserveRule.mode).toBe("logical");
    expect(state.safeToSpend).toBe(86_000);
    expect(state.currentStep).toBe("rule_active");
  });

  test("action touching protected obligations is rejected by policy", () => {
    const state = createInitialState("horeca");
    const decision = authorizeAction(state, {
      id: "action_reserve_use",
      type: "use_reserve",
      title: "Использовать резерв",
      rationale: "Попробовать покрыть обязательство резервом",
      requiresConfirmation: true,
      impact: {
        risk: 4,
        cost: 0,
        debtLoad: 0,
        businessImpact: 3,
        projectedMinimumBalance: 0,
      },
    });

    expect(decision.ok).toBe(false);
  });

  test("30-day plan simulation stays deterministic for August 2026 demo data", () => {
    const plan = build30DayPlan({
      startDate: "2026-08-11",
      openingBalance: 420_000,
      cashEvents: createCashEvents(),
      obligations: [
        ...createBaseObligations().filter((obligation) => obligation.id !== "supplier"),
        {
          ...createBaseObligations().find((obligation) => obligation.id === "supplier")!,
          dueDate: "2026-08-18",
          status: "confirmed",
        },
      ],
    });

    expect(plan.days).toHaveLength(30);
    expect(plan.days[0]?.date).toBe("2026-08-11");
    expect(plan.minimumBalance).toBeGreaterThanOrEqual(110_000);
  });

  test("formatting uses Russian rubles and Russian dates", () => {
    expect(formatMoney(420_000)).toBe("420 000 ₽");
    expect(formatRuDate("2026-08-18")).toBe("18 августа");
  });

  test("all three industry profiles are registered in one typed registry", () => {
    expect(Object.keys(INDUSTRY_PROFILES)).toEqual(["horeca", "beauty", "retail"]);
  });

  test("each profile keeps Safe-to-Spend math consistent with its envelope set", () => {
    for (const profileId of ["horeca", "beauty", "retail"] as const) {
      let state = createInitialState(profileId);
      const fixture = PROFILE_FINANCE_FIXTURES[profileId];
      const committedFromEnvelopes = fixture.envelopes.reduce((sum, envelope) => sum + envelope.amount, 0);

      state = demoReducer(state, { type: "pick_clarification_date", isoDate: "2026-08-18" });
      state = demoReducer(state, { type: "apply_clarification" });

      expect(committedFromEnvelopes).toBe(state.committedTotal);
      expect(state.currentAccountsTotal - state.committedTotal).toBe(state.safeToSpend);
    }
  });
});
