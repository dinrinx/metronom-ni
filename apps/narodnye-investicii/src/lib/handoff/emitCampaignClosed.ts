import type { BusinessProfile, Campaign } from "@/types";
import { type CampaignClosed, writeHandoff } from "@m/lib/handoff/campaign-closed";

function isCompleteCampaign(campaign: Partial<Campaign>): campaign is Campaign {
  return (
    typeof campaign.id === "string" &&
    typeof campaign.title === "string" &&
    typeof campaign.goalAmount === "number" &&
    typeof campaign.raisedPercent === "number" &&
    typeof campaign.supportersCount === "number" &&
    Array.isArray(campaign.bonuses) &&
    typeof campaign.status === "string"
  );
}

function toClosedStatus(status: CampaignClosed["status"] | Campaign["status"]): CampaignClosed["status"] {
  if (status === "перевыполнена" || status === "не хватило") return status;
  return "реализовано";
}

export function emitCampaignClosed(campaign: Partial<Campaign>, activeProfile: BusinessProfile): boolean {
  if (!isCompleteCampaign(campaign)) return false;

  return writeHandoff({
    campaignId: campaign.id,
    profileId: activeProfile.id,
    title: campaign.title,
    goalAmount: campaign.goalAmount,
    raisedAmount: (campaign.goalAmount * campaign.raisedPercent) / 100,
    supportersCount: campaign.supportersCount,
    status: toClosedStatus(campaign.status),
    rewards: campaign.bonuses.map((title) => ({ title, quantity: campaign.supportersCount })),
    closedAt: new Date().toISOString(),
  });
}
