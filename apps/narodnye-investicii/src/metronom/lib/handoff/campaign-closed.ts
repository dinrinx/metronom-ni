export type CampaignClosed = {
  campaignId: string;
  profileId: "horeca" | "beauty" | "retail";
  title: string;
  goalAmount: number;
  raisedAmount: number;
  supportersCount: number;
  status: "реализовано" | "перевыполнена" | "не хватило";
  rewards: {
    title: string;
    quantity?: number;
    deadline?: string;
    unitCost?: number;
  }[];
  closedAt: string;
};

export const HANDOFF_KEY = "handoff:campaign-closed";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isReward(value: unknown): value is CampaignClosed["rewards"][number] {
  if (!isRecord(value) || typeof value.title !== "string") return false;

  return (
    (value.quantity === undefined || isFiniteNumber(value.quantity)) &&
    (value.deadline === undefined || typeof value.deadline === "string") &&
    (value.unitCost === undefined || isFiniteNumber(value.unitCost))
  );
}

function isCampaignClosed(value: unknown): value is CampaignClosed {
  if (!isRecord(value)) return false;

  return (
    typeof value.campaignId === "string" &&
    (value.profileId === "horeca" || value.profileId === "beauty" || value.profileId === "retail") &&
    typeof value.title === "string" &&
    isFiniteNumber(value.goalAmount) &&
    isFiniteNumber(value.raisedAmount) &&
    isFiniteNumber(value.supportersCount) &&
    (value.status === "реализовано" || value.status === "перевыполнена" || value.status === "не хватило") &&
    Array.isArray(value.rewards) &&
    value.rewards.every(isReward) &&
    typeof value.closedAt === "string"
  );
}

export function writeHandoff(event: CampaignClosed): boolean {
  try {
    if (!isCampaignClosed(event)) return false;
    localStorage.setItem(HANDOFF_KEY, JSON.stringify(event));
    return true;
  } catch {
    return false;
  }
}

export function readHandoff(): CampaignClosed | null {
  try {
    const rawEvent = localStorage.getItem(HANDOFF_KEY);
    if (rawEvent === null) return null;

    const event: unknown = JSON.parse(rawEvent);
    return isCampaignClosed(event) ? event : null;
  } catch {
    return null;
  }
}

export function clearHandoff(): boolean {
  try {
    localStorage.removeItem(HANDOFF_KEY);
    return true;
  } catch {
    return false;
  }
}
