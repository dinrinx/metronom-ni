import type { Obligation } from "@m/domain/types";
import type { CampaignClosed } from "./campaign-closed";

export const BACKERS_OBLIGATION_ID = "backers";

type Reward = CampaignClosed["rewards"][number];

export function isRewardComplete(reward: Reward): reward is Reward & { quantity: number; deadline: string; unitCost: number } {
  return reward.quantity !== undefined && reward.deadline !== undefined && reward.unitCost !== undefined;
}

export function applyCampaignClosed(event: CampaignClosed): Obligation[] {
  return event.rewards.map((reward, index) => {
    const complete = isRewardComplete(reward);

    return {
      id: `backer_${event.campaignId}_${index}`,
      category: "backer",
      title: reward.title,
      amount: complete ? reward.quantity * reward.unitCost : 0,
      dueDate: reward.deadline ?? null,
      status: complete ? "confirmed" : "ambiguous",
      priority: "important",
      sourceSummary: `Награда бэкерам сбора «${event.title}»`,
      sources: [
        {
          id: `src_campaign_${event.campaignId}`,
          type: "crowdfunding",
          title: "Кампания «Народные инвестиции»",
          capturedAt: event.closedAt,
        },
      ],
    };
  });
}

export function sumConfirmed(obligations: Obligation[]): number {
  return obligations.filter((item) => item.status === "confirmed").reduce((sum, item) => sum + item.amount, 0);
}

export function latestDueDate(obligations: Obligation[]): string | null {
  const dates = obligations.flatMap((item) => (item.dueDate ? [item.dueDate] : []));
  return dates.length > 0 ? dates.sort().at(-1)! : null;
}

// Заменяет существующее обязательство бэкеров суммой подтверждённых наград, не добавляя новых.
export function mergeBackerObligation(obligations: Obligation[], refined: Obligation[]): Obligation[] {
  const amount = sumConfirmed(refined);
  const dueDate = latestDueDate(refined);

  return obligations.map((obligation) =>
    obligation.id === BACKERS_OBLIGATION_ID
      ? {
          ...obligation,
          amount,
          dueDate: dueDate ?? obligation.dueDate,
          status: "confirmed" as const,
          sourceSummary: `Награды бэкерам: ${refined.map((item) => item.title).join(", ")}`,
          sources: [...obligation.sources, ...refined.flatMap((item) => item.sources).slice(0, 1)],
        }
      : obligation,
  );
}
