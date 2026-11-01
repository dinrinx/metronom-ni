import type { DemoState, ProposedAction } from "@m/domain/types";

export type PolicyDecision =
  | { ok: true; status: "prepared" | "awaiting_confirmation" }
  | { ok: false; reason: string };

export function authorizeAction(state: DemoState, action: ProposedAction): PolicyDecision {
  if (action.type === "use_reserve") {
    return {
      ok: false,
      reason: "Нельзя использовать резерв, пока защищённые обязательства не закрыты отдельным подтверждением.",
    };
  }

  if (action.type === "draft_transfer") {
    return {
      ok: true,
      status: "awaiting_confirmation",
    };
  }

  if (action.type === "set_reserve_rule" && action.reserveMode === "logical") {
    return {
      ok: true,
      status: "prepared",
    };
  }

  if (action.requiresConfirmation && state.businessStatus === "risk") {
    return {
      ok: true,
      status: "awaiting_confirmation",
    };
  }

  return {
    ok: true,
    status: action.requiresConfirmation ? "awaiting_confirmation" : "prepared",
  };
}
