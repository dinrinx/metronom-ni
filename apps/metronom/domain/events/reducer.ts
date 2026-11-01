import type {
  AuditEntry,
  ConnectedSourceId,
  DemoState,
  DemoStepId,
  IndustryProfileId,
  ProposedAction,
  ReserveMode,
  SourceRef,
} from "@/domain/types";
import { calculateSafeToSpend, calculateTotalCommitted } from "@/domain/finance/calculate-safe-to-spend";
import { createEnvelopes, createInitialState, DEMO_NOW } from "@/lib/demo/fixtures";
import { authorizeAction } from "@/domain/policy/authorize-action";
import { FALLBACK_EXPLANATIONS } from "@/lib/demo/fallback-responses";
import { INDUSTRY_PROFILES } from "@/lib/industry/profiles";

export type DemoAction =
  | { type: "select_profile"; profileId: IndustryProfileId }
  | { type: "change_profile"; profileId: IndustryProfileId }
  | { type: "set_provider_mode"; mode: DemoState["providerMode"] }
  | { type: "submit_login" }
  | { type: "show_login_error" }
  | { type: "go_to_step"; step: DemoStepId; pushHistory?: boolean }
  | { type: "go_back" }
  | { type: "connect_source"; sourceId: ConnectedSourceId }
  | { type: "advance_processing" }
  | { type: "reset_processing" }
  | { type: "pick_clarification_date"; isoDate: string }
  | { type: "apply_clarification" }
  | { type: "open_envelope"; envelopeId: string }
  | { type: "prepare_reserve_rule" }
  | { type: "select_reserve_mode"; mode: ReserveMode }
  | { type: "save_reserve_format" }
  | { type: "confirm_transfer" }
  | { type: "set_llm_explanation"; text: string; source: "fallback" | "live" }
  | { type: "show_toast"; message: string | null }
  | { type: "reset_demo" };

function addAudit(state: DemoState, title: string, details: string): AuditEntry[] {
  return [
    {
      id: `audit_${state.auditTrail.length + 1}`,
      at: DEMO_NOW,
      title,
      details,
    },
    ...state.auditTrail,
  ];
}

function pushStep(state: DemoState, step: DemoStepId, pushHistory = true): DemoState {
  return {
    ...state,
    currentStep: step,
    stepHistory: pushHistory ? [...state.stepHistory, state.currentStep] : state.stepHistory,
  };
}

function recalculateState(state: DemoState, reason: string): DemoState {
  const committedTotal = calculateTotalCommitted(state.obligations);
  const safeToSpend = calculateSafeToSpend(state.currentAccountsTotal, committedTotal);

  return {
    ...state,
    committedTotal,
    safeToSpend,
    lastRecalculatedAt: DEMO_NOW,
    recalculationHistory: [
      {
        at: DEMO_NOW,
        reason,
        safeToSpend,
        committedTotal,
      },
      ...state.recalculationHistory,
    ],
  };
}

function logicalReserveAction(state: DemoState): ProposedAction {
  return {
    id: "action_reserve_logical",
    type: "set_reserve_rule",
    title: "Логически защищать страховой запас",
    rationale: "Резерв пополняется только из новых свободных поступлений и не двигает деньги между реальными счетами.",
    requiresConfirmation: false,
    reserveMode: "logical",
    impact: {
      risk: 1,
      cost: 0,
      debtLoad: 0,
      businessImpact: 1,
      projectedMinimumBalance: state.safeToSpend,
    },
  };
}

function separateReserveAction(state: DemoState): ProposedAction {
  return {
    id: "action_reserve_transfer",
    type: "draft_transfer",
    title: "Подготовить перевод страхового запаса",
    rationale: "Физически отделить 18 000 ₽ на накопительный счёт Альфы после отдельного подтверждения.",
    requiresConfirmation: true,
    reserveMode: "separate_account",
    transferAmount: 18_000,
    impact: {
      risk: 2,
      cost: 0,
      debtLoad: 0,
      businessImpact: 1,
      projectedMinimumBalance: state.safeToSpend - 18_000,
    },
  };
}

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "select_profile": {
      return pushStep(createInitialState(action.profileId), "login", false);
    }
    case "change_profile": {
      const next = createInitialState(action.profileId);
      const changed = {
        ...next,
        providerMode: state.providerMode,
        auditTrail: addAudit(
          next,
          "Профиль бизнеса изменён",
          "Сценарный прогресс сброшен, чтобы данные разных отраслей не смешивались.",
        ),
      };
      return pushStep(changed, "login", false);
    }
    case "set_provider_mode":
      return {
        ...state,
        providerMode: action.mode,
      };
    case "submit_login":
      return pushStep(
        {
          ...state,
          loginStatus: "success",
          businessStatus: "needs_clarification",
        },
        "home_entry",
      );
    case "show_login_error":
      return {
        ...state,
        loginStatus: "error",
      };
    case "go_to_step":
      return pushStep(state, action.step, action.pushHistory ?? true);
    case "go_back": {
      const history = [...state.stepHistory];
      const previousStep = history.pop();
      if (previousStep === undefined) {
        return state;
      }
      return {
        ...state,
        currentStep: previousStep,
        stepHistory: history,
      };
    }
    case "connect_source":
      if (action.sourceId === "alfa_account") {
        const nextConnected = !(state.connectedSources.alfa_account && state.connectedSources.alfa_acquiring && state.connectedSources.alfa_sbp);
        return {
          ...state,
          connectedSources: {
            ...state.connectedSources,
            alfa_account: nextConnected,
            alfa_acquiring: nextConnected,
            alfa_sbp: nextConnected,
          },
        };
      }
      return {
        ...state,
        connectedSources: {
          ...state.connectedSources,
          [action.sourceId]: !state.connectedSources[action.sourceId],
        },
      };
    case "advance_processing": {
      const nextIndex = Math.min(state.processingIndex + 1, 5);
      if (nextIndex === 5) {
        return pushStep(
          {
            ...state,
            processingIndex: nextIndex,
            businessStatus: "needs_clarification",
            auditTrail: addAudit(
              state,
              "Собрана модель обязательств",
              "Метроном нашёл неоднозначную дату в договоре поставщика и остановил расчёт до подтверждения.",
            ),
          },
          "found",
        );
      }
      return {
        ...state,
        processingIndex: nextIndex,
      };
    }
    case "reset_processing":
      return {
        ...state,
        processingIndex: 0,
      };
    case "pick_clarification_date":
      return {
        ...state,
        clarificationChoice: action.isoDate,
      };
    case "apply_clarification": {
      if (state.clarificationChoice === null) {
        return state;
      }

      const obligations = state.obligations.map((obligation) =>
        obligation.id === "supplier"
          ? {
              ...obligation,
              dueDate: action.type === "apply_clarification" ? state.clarificationChoice : obligation.dueDate,
              status: "confirmed" as const,
              sourceSummary: `${INDUSTRY_PROFILES[state.industryProfileId].invoiceSubject}, дата уточнена пользователем`,
              sources: [
                ...obligation.sources,
                {
                  id: "src_user_choice",
                  type: "user_confirmation",
                  title: "Выбор пользователя",
                  capturedAt: DEMO_NOW,
                } satisfies SourceRef,
              ],
            }
          : obligation,
      );

      const recalculated = recalculateState(
        {
          ...state,
          obligations,
          clarificationApplied: true,
          businessStatus: "ok",
          envelopes: createEnvelopes(state.industryProfileId),
        },
        `Подтверждена дата поставщика ${state.clarificationChoice}`,
      );

      return pushStep(
        {
          ...recalculated,
          auditTrail: addAudit(
            recalculated,
            "Уточнена дата поставщика",
            `Вы подтвердили ${state.clarificationChoice}; план и конверты пересчитаны.`,
          ),
          llmExplanation: FALLBACK_EXPLANATIONS[recalculated.industryProfileId],
          llmExplanationSource: "fallback",
        },
        "safe_to_spend",
      );
    }
    case "open_envelope":
      return pushStep(
        {
          ...state,
          selectedEnvelopeId: action.envelopeId,
        },
        "envelope_detail",
      );
    case "prepare_reserve_rule":
      return pushStep(
        {
          ...state,
          reserveRule: {
            ...state.reserveRule,
            mode: "logical",
            status: "prepared",
          },
          preparedAction: logicalReserveAction(state),
        },
        "reserve_format",
      );
    case "select_reserve_mode":
      return {
        ...state,
        reserveRule: {
          ...state.reserveRule,
          mode: action.mode,
        },
        preparedAction: action.mode === "logical" ? logicalReserveAction(state) : separateReserveAction(state),
      };
    case "save_reserve_format": {
      const mode = state.reserveRule.mode ?? "logical";
      const preparedAction = mode === "logical" ? logicalReserveAction(state) : separateReserveAction(state);
      const policy = authorizeAction(state, preparedAction);

      if (!policy.ok) {
        return {
          ...state,
          featureToast: policy.reason,
        };
      }

      if (mode === "separate_account") {
        return pushStep(
          {
            ...state,
            preparedAction,
            reserveRule: {
              ...state.reserveRule,
              status: "awaiting_confirmation",
            },
            auditTrail: addAudit(
              state,
              "Подготовлен перевод резерва",
              "Метроном подготовил перевод 18 000 ₽, но без подтверждения деньги не двигаются.",
            ),
          },
          "transfer_confirm",
        );
      }

      return pushStep(
        {
          ...state,
          preparedAction,
          reserveRule: {
            ...state.reserveRule,
            mode: "logical",
            status: "completed",
          },
          businessStatus: "ok",
          auditTrail: addAudit(
            state,
            "Активировано логическое правило резерва",
            "Резерв будет пополняться только из свободных поступлений. Реального перевода не произошло.",
          ),
        },
        "rule_active",
      );
    }
    case "confirm_transfer": {
      const nextSafeToSpend = Math.max(0, state.safeToSpend - 18_000);
      return pushStep(
        {
          ...state,
          safeToSpend: nextSafeToSpend,
          preparedAction: state.preparedAction
            ? {
                ...state.preparedAction,
                impact: {
                  ...state.preparedAction.impact,
                  projectedMinimumBalance: nextSafeToSpend,
                },
              }
            : null,
          reserveRule: {
            ...state.reserveRule,
            status: "completed",
            mode: "separate_account",
            currentAmount: 36_000,
          },
          businessStatus: "ok",
          auditTrail: addAudit(
            state,
            "Перевод резерва подтверждён",
            "Резерв переведён на отдельный счёт после подтверждения пользователя.",
          ),
        },
        "rule_active",
      );
    }
    case "set_llm_explanation":
      return {
        ...state,
        llmExplanation: action.text,
        llmExplanationSource: action.source,
      };
    case "show_toast":
      return {
        ...state,
        featureToast: action.message,
      };
    case "reset_demo":
      return createInitialState(state.industryProfileId);
    default:
      return state;
  }
}
