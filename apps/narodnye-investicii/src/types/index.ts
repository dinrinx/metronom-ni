export type IndustryId = "beauty" | "horeca" | "retail";

export type RiskLevel = "low" | "medium" | "high";

export interface Donor {
  name: string;
  amount: number;
}

export type CampaignType = "first" | "stability" | "crisis";
export type CampaignStatus = "активна" | "реализовано" | "перевыполнена" | "не хватило" | "закрыта";

export interface Campaign {
  id: string;
  type: CampaignType;
  title: string;
  goal: string;
  goalAmount: number;
  raisedPercent: number;
  supportersCount: number;
  donors: Donor[];
  bonuses: string[];
  status: CampaignStatus;
  createdAt: string;
}

export interface StabilityFundEntry {
  vendor: string;
  amount: number;
  date: string;
}

export interface LastTransaction {
  amount: number;
  discountPercent: number;
  viaProduct: string;
  date: string;
}

export interface TrustRating {
  level: string;
  nextLevel: string;
  progressPercent: number;
  turnoverNote: string;
  productsConnected: number;
  productsTotal: number;
}

export interface SandboxResult {
  capital: number;
  paybackMonths: number;
  risk: RiskLevel;
  recommendedAmount: number;
}

export interface SandboxInputs {
  niche: IndustryId | null;
  city: string;
  revenue: string;
  expenses: string;
  avgCheck: string;
  clients: string;
}

export interface BusinessProfile {
  id: IndustryId;
  ownerName: string;
  legalForm: "ИП" | "Самозанятый";
  city: string;
  legalStatusLabel: string;
  industryLabel: string;
  products: string[];
  accountBalance: number;
  stabilityFund: number;
  stabilityFundHistory: StabilityFundEntry[];
  trustRating: TrustRating;
  campaigns: Campaign[];
  lastTransaction: LastTransaction;
  sandboxResult: SandboxResult | null;
  sandboxInputs: SandboxInputs | null;
  hasOverdraft: boolean;
  altCreditUnlocked: boolean;
  aiRiskDaysAway: number | null;
  aiRiskAdvice: string | null;
}

export interface AppState {
  hasSeenIntro: boolean;
  hasOpenedAccount: boolean;
  activeProfileId: IndustryId;
  profiles: Record<IndustryId, BusinessProfile>;
}
