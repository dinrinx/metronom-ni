import type { BusinessProfile } from "@/types";

export type HistoryEntryKind = "donation" | "payment" | "fund-payout";

export interface HistoryEntry {
  id: string;
  kind: HistoryEntryKind;
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  campaignId: string | null;
}

export function buildHistoryEntries(profile: BusinessProfile): HistoryEntry[] {
  const entries: HistoryEntry[] = [];

  for (const campaign of profile.campaigns) {
    campaign.donors.forEach((donor, i) => {
      entries.push({
        id: `${campaign.id}-donor-${i}`,
        kind: "donation",
        title: `${donor.name} поддержал(а) сбор`,
        subtitle: campaign.title,
        amount: donor.amount,
        date: campaign.createdAt,
        campaignId: campaign.id,
      });
    });
  }

  entries.push({
    id: "last-transaction",
    kind: "payment",
    title: `Оплата через ${profile.lastTransaction.viaProduct}`,
    subtitle: `Скидка донатеру −${profile.lastTransaction.discountPercent}%`,
    amount: profile.lastTransaction.amount,
    date: profile.lastTransaction.date,
    campaignId: null,
  });

  for (const entry of profile.stabilityFundHistory) {
    entries.push({
      id: `fund-${entry.vendor}-${entry.date}`,
      kind: "fund-payout",
      title: `Альфа оплатила «${entry.vendor}» напрямую`,
      subtitle: "Из Фонда стабильности",
      amount: entry.amount,
      date: entry.date,
      campaignId: null,
    });
  }

  return entries.sort((a, b) => (a.date < b.date ? 1 : -1));
}
