import type { ProposedAction } from "@/domain/types";

export function compareActions(actions: ProposedAction[]): ProposedAction[] {
  return [...actions].sort((left, right) => {
    if (left.impact.risk !== right.impact.risk) {
      return left.impact.risk - right.impact.risk;
    }
    if (left.impact.cost !== right.impact.cost) {
      return left.impact.cost - right.impact.cost;
    }
    if (left.impact.debtLoad !== right.impact.debtLoad) {
      return left.impact.debtLoad - right.impact.debtLoad;
    }
    return left.impact.businessImpact - right.impact.businessImpact;
  });
}
