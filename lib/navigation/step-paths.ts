import type { DemoStepId } from "@/domain/types";

export const STEP_PATHS: Record<DemoStepId, string> = {
  profile_picker: "/",
  login: "/login",
  home_entry: "/home",
  intro: "/intro",
  sources: "/sources",
  processing: "/processing",
  found: "/obligations",
  clarification: "/clarification",
  safe_to_spend: "/safe-to-spend",
  how_calculated: "/how-calculated",
  envelopes: "/envelopes",
  envelope_detail: "/envelopes/detail",
  reserve_rule: "/reserve-rule",
  reserve_format: "/reserve-format",
  transfer_confirm: "/transfer-confirm",
  rule_active: "/rule-active",
  risk_detail: "/cycle/risk",
  risk_one_action: "/cycle/risk/action",
  risk_compare: "/cycle/risk/compare",
  risk_done: "/cycle/risk/done",
  risk_bridge: "/cycle/risk/next-path",
  invoice_new: "/cycle/invoice",
  invoice_clarify: "/cycle/invoice/clarify",
  invoice_legal: "/cycle/invoice/legal",
  invoice_draft: "/cycle/invoice/draft",
  invoice_safe_date: "/cycle/invoice/date",
  invoice_done: "/cycle/invoice/done",
  backers_progress: "/cycle/backers",
  backers_done: "/cycle/backers/done",
  backers_growth: "/cycle/backers/growth",
  invest_prompt: "/cycle/invest",
  invest_variants: "/cycle/invest/compare",
  invest_plan: "/cycle/invest/plan",
  fundraise_intro: "/cycle/fundraise",
  fundraise_recommend: "/cycle/fundraise/recommend",
  fundraise_compare: "/cycle/fundraise/compare",
  credit_history_unlock: "/credit-history",
  credit_history_products: "/credit-history/products",
};

const PATH_TO_STEP = new Map<string, DemoStepId>(
  Object.entries(STEP_PATHS).map(([step, path]) => [path, step as DemoStepId]),
);

export function getPathForStep(step: DemoStepId) {
  return STEP_PATHS[step];
}

export function getStepForPath(pathname: string): DemoStepId {
  return PATH_TO_STEP.get(pathname) ?? "profile_picker";
}
