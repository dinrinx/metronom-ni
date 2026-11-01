import { describe, expect, test } from "vitest";
import { demoReducer } from "../../src/metronom/domain/events/reducer";
import { createInitialState } from "../../src/metronom/lib/demo/fixtures";
import { applyCampaignClosed, mergeBackerObligation, sumConfirmed } from "../../src/metronom/lib/handoff/applyCampaignClosed";
import type { CampaignClosed } from "../../src/metronom/lib/handoff/campaign-closed";

const baseEvent: CampaignClosed = {
  campaignId: "c1",
  profileId: "horeca",
  title: "Абонемент",
  goalAmount: 60_000,
  raisedAmount: 60_000,
  supportersCount: 3,
  status: "реализовано",
  rewards: [],
  closedAt: "2026-11-01T10:00:00.000Z",
};

describe("applyCampaignClosed", () => {
  test("all rewards recognized: confirmed with amount = quantity * unitCost", () => {
    const obligations = applyCampaignClosed({
      ...baseEvent,
      rewards: [
        { title: "Скидка", quantity: 10, deadline: "2026-09-01", unitCost: 500 },
        { title: "Промокод", quantity: 4, deadline: "2026-09-10", unitCost: 250 },
      ],
    });

    expect(obligations.map((item) => item.status)).toEqual(["confirmed", "confirmed"]);
    expect(obligations.map((item) => item.amount)).toEqual([5_000, 1_000]);
    expect(obligations.every((item) => item.category === "backer")).toBe(true);
    expect(obligations[0]?.dueDate).toBe("2026-09-01");
    expect(sumConfirmed(obligations)).toBe(6_000);
  });

  test("reward missing any of quantity, deadline, unitCost is ambiguous with zero amount", () => {
    const obligations = applyCampaignClosed({
      ...baseEvent,
      rewards: [
        { title: "Только название" },
        { title: "Нет срока", quantity: 2, unitCost: 100 },
        { title: "Нет себестоимости", quantity: 2, deadline: "2026-09-01" },
        { title: "Полная", quantity: 2, deadline: "2026-09-01", unitCost: 100 },
      ],
    });

    expect(obligations.map((item) => item.status)).toEqual(["ambiguous", "ambiguous", "ambiguous", "confirmed"]);
    expect(obligations.map((item) => item.amount)).toEqual([0, 0, 0, 200]);
    expect(obligations[1]?.dueDate).toBeNull();
  });

  test("underfunded campaign keeps rewards as they are; shortfall is derived from the event", () => {
    const event: CampaignClosed = {
      ...baseEvent,
      status: "не хватило",
      raisedAmount: 48_000,
      rewards: [{ title: "Скидка", quantity: 1, deadline: "2026-09-01", unitCost: 700 }],
    };
    const obligations = applyCampaignClosed(event);

    expect(event.goalAmount - event.raisedAmount).toBe(12_000);
    expect(obligations).toHaveLength(1);
    expect(sumConfirmed(obligations)).toBe(700);
  });

  test("empty rewards list gives no obligations and zero backers total", () => {
    const obligations = applyCampaignClosed(baseEvent);
    expect(obligations).toEqual([]);
    expect(sumConfirmed(obligations)).toBe(0);
  });
});

describe("apply_campaign_handoff reducer case", () => {
  test("updates the existing backers obligation and envelope without adding new ones", () => {
    const state = createInitialState("horeca");
    const obligations = applyCampaignClosed({
      ...baseEvent,
      rewards: [{ title: "Скидка", quantity: 10, deadline: "2026-09-01", unitCost: 500 }],
    });
    const next = demoReducer(state, { type: "apply_campaign_handoff", campaignTitle: "Абонемент", obligations });

    expect(next.obligations).toHaveLength(state.obligations.length);
    expect(next.envelopes).toHaveLength(state.envelopes.length);
    expect(next.obligations.find((item) => item.id === "backers")?.amount).toBe(5_000);
    expect(next.envelopes.find((item) => item.id === "env_backers")?.protectedAmount).toBe(5_000);
    expect(next.committedTotal).toBe(
      mergeBackerObligation(state.obligations, obligations)
        .filter((item) => item.status === "confirmed")
        .reduce((sum, item) => sum + item.amount, 0),
    );
    expect(next.safeToSpend).toBe(Math.max(0, state.currentAccountsTotal - next.committedTotal));
    expect(next.auditTrail.length).toBe(state.auditTrail.length + 1);
    expect(next.campaignCommittedSlice).toBe(5_000);
    expect(next.currentStep).toBe("safe_to_spend");
  });
});
