import type {
  AuditEntry,
  CashEvent,
  ConnectedSourceState,
  DemoState,
  Envelope,
  ObligationCategory,
  ObligationPriority,
  IndustryProfileId,
  Obligation,
  ProcessingTask,
  SourceRef,
} from "@m/domain/types";
import { DEFAULT_PROVIDER_MODE } from "@m/lib/demo/fallback-responses";
import { calculateSafeToSpend, calculateTotalCommitted } from "@m/domain/finance/calculate-safe-to-spend";
import { INDUSTRY_PROFILES } from "@m/lib/industry/profiles";

export const DEMO_NOW = "2026-08-11T09:41:00.000Z";
export const DEMO_BASE_DATE = "2026-08-11";
export const CLARIFY_OPTIONS = ["2026-08-14", "2026-08-18"] as const;

export const PROCESSING_TASKS: ProcessingTask[] = [
  { id: "contracts", label: "Распознал 4 договора", hint: "готово" },
  { id: "invoices", label: "Сверяю 11 счетов", hint: "готово" },
  { id: "calendar", label: "Собираю календарь выплат", hint: "готово" },
  { id: "ambiguity", label: "Проверяю неоднозначные условия", hint: "готово" },
  { id: "free_cash", label: "Рассчитываю свободные деньги", hint: "готово" },
];

type ProfileCommittedEnvelopeSeed = {
  id: "env_rent_payroll" | "env_backers" | "env_tax" | "env_supplier";
  obligationId: "rent" | "backers" | "tax" | "supplier";
  category: ObligationCategory;
  title: string;
  amount: number;
  dueDate: string | null;
  dueLabel: string;
  priority: ObligationPriority;
};

type ProfileFinanceFixture = {
  currentAccountsTotal: number;
  campaignCommittedSlice: number;
  envelopes: ProfileCommittedEnvelopeSeed[];
};

export const PROFILE_FINANCE_FIXTURES: Record<IndustryProfileId, ProfileFinanceFixture> = {
  horeca: {
    currentAccountsTotal: 420_000,
    campaignCommittedSlice: 250_000,
    envelopes: [
      {
        id: "env_rent_payroll",
        obligationId: "rent",
        category: "rent",
        title: "Аренда и ФОТ",
        amount: 150_000,
        dueDate: "2026-08-20",
        dueLabel: "до 20 августа",
        priority: "critical",
      },
      {
        id: "env_backers",
        obligationId: "backers",
        category: "backer",
        title: "Бэкеры",
        amount: 124_000,
        dueDate: "2026-08-31",
        dueLabel: "до 31 августа",
        priority: "important",
      },
      {
        id: "env_tax",
        obligationId: "tax",
        category: "tax",
        title: "Налоги",
        amount: 32_000,
        dueDate: "2026-08-28",
        dueLabel: "до 28 августа",
        priority: "critical",
      },
      {
        id: "env_supplier",
        obligationId: "supplier",
        category: "supplier",
        title: "Поставщики (ингредиенты)",
        amount: 28_000,
        dueDate: null,
        dueLabel: "18 августа",
        priority: "important",
      },
    ],
  },
  beauty: {
    currentAccountsTotal: 380_000,
    campaignCommittedSlice: 220_000,
    envelopes: [
      {
        id: "env_rent_payroll",
        obligationId: "rent",
        category: "rent",
        title: "Аренда кресла и помещение",
        amount: 130_000,
        dueDate: "2026-08-20",
        dueLabel: "до 20 августа",
        priority: "critical",
      },
      {
        id: "env_backers",
        obligationId: "backers",
        category: "backer",
        title: "Бэкеры (процедуры, абонементы)",
        amount: 100_000,
        dueDate: "2026-08-31",
        dueLabel: "до 31 августа",
        priority: "important",
      },
      {
        id: "env_tax",
        obligationId: "tax",
        category: "tax",
        title: "Налоги",
        amount: 30_000,
        dueDate: "2026-08-28",
        dueLabel: "до 28 августа",
        priority: "critical",
      },
      {
        id: "env_supplier",
        obligationId: "supplier",
        category: "supplier",
        title: "Расходники (материалы)",
        amount: 40_000,
        dueDate: null,
        dueLabel: "18 августа",
        priority: "important",
      },
    ],
  },
  retail: {
    currentAccountsTotal: 460_000,
    campaignCommittedSlice: 260_000,
    envelopes: [
      {
        id: "env_rent_payroll",
        obligationId: "rent",
        category: "rent",
        title: "Аренда и ФОТ",
        amount: 160_000,
        dueDate: "2026-08-20",
        dueLabel: "до 20 августа",
        priority: "critical",
      },
      {
        id: "env_backers",
        obligationId: "backers",
        category: "backer",
        title: "Бэкеры (товарные наборы)",
        amount: 130_000,
        dueDate: "2026-08-31",
        dueLabel: "до 31 августа",
        priority: "important",
      },
      {
        id: "env_tax",
        obligationId: "tax",
        category: "tax",
        title: "Налоги",
        amount: 35_000,
        dueDate: "2026-08-28",
        dueLabel: "до 28 августа",
        priority: "critical",
      },
      {
        id: "env_supplier",
        obligationId: "supplier",
        category: "supplier",
        title: "Закупка товара",
        amount: 35_000,
        dueDate: null,
        dueLabel: "18 августа",
        priority: "important",
      },
    ],
  },
};

export function getProfileFinanceFixture(profileId: IndustryProfileId) {
  return PROFILE_FINANCE_FIXTURES[profileId];
}

function source(id: string, type: SourceRef["type"], title: string): SourceRef {
  return {
    id,
    type,
    title,
    capturedAt: DEMO_NOW,
  };
}

const commonSources = {
  alfaAccount: source("src_alfa_account", "bank_operation", "Счёт банка"),
  alfaAcquiring: source("src_alfa_acquiring", "bank_operation", "Эквайринг банка"),
  niCampaign: source("src_campaign", "crowdfunding", "Кампания «Народные инвестиции»"),
  lease: source("src_lease", "contract", "Договор аренды №7-А от 12 марта"),
  payroll: source("src_payroll", "payroll", "Зарплатный реестр"),
  tax: source("src_tax", "tax", "Налоговый календарь"),
  supplier: source("src_supplier", "contract", "Договор поставщика №14-К"),
  user: source("src_user", "user_confirmation", "Подтверждение пользователя"),
};

export function createInitialConnectedSources(): ConnectedSourceState {
  return {
    alfa_account: true,
    alfa_acquiring: true,
    alfa_sbp: true,
    multibank: false,
    documents: false,
    industry_ops: false,
  };
}

function buildSourceSummary(profileId: IndustryProfileId, obligationId: ProfileCommittedEnvelopeSeed["obligationId"]) {
  const profile = INDUSTRY_PROFILES[profileId];

  switch (obligationId) {
    case "rent":
      return `Регулярное обязательство по категории «${profile.rentEnvelope}»`;
    case "tax":
      return "Налоговый режим / календарь";
    case "backers":
      return `${profile.campaignBackers} rewards · ${profile.rewardLabel}`;
    case "supplier":
      return `${profile.invoiceSubject}, дата требует подтверждения`;
    default:
      return "";
  }
}

function buildObligationSources(obligationId: ProfileCommittedEnvelopeSeed["obligationId"]) {
  switch (obligationId) {
    case "rent":
      return [commonSources.lease];
    case "tax":
      return [commonSources.tax];
    case "backers":
      return [commonSources.niCampaign];
    case "supplier":
      return [commonSources.supplier];
    default:
      return [commonSources.user];
  }
}

export function createBaseObligations(profileId: IndustryProfileId = "horeca"): Obligation[] {
  const fixture = getProfileFinanceFixture(profileId);

  return fixture.envelopes.map((item) => ({
    id: item.obligationId,
    category: item.category,
    title: item.title,
    amount: item.amount,
    dueDate: item.dueDate,
    status: item.obligationId === "supplier" ? "ambiguous" : "confirmed",
    priority: item.priority,
    sourceSummary: buildSourceSummary(profileId, item.obligationId),
    sources: buildObligationSources(item.obligationId),
  }));
}

export function createCashEvents(profileId: IndustryProfileId = "horeca"): CashEvent[] {
  const fixture = getProfileFinanceFixture(profileId);

  return [
    {
      id: "cash_start",
      date: "2026-08-11",
      amount: fixture.currentAccountsTotal,
      kind: "actual",
      label: "Текущий ликвидный остаток",
      source: commonSources.alfaAccount,
    },
    {
      id: "daily_sales_13",
      date: "2026-08-13",
      amount: 32_000,
      kind: "forecast",
      label: "Поступления по эквайрингу",
      source: commonSources.alfaAcquiring,
    },
    {
      id: "daily_sales_16",
      date: "2026-08-16",
      amount: 24_000,
      kind: "forecast",
      label: "Поступления по СБП и эквайрингу",
      source: commonSources.alfaAcquiring,
    },
    {
      id: "daily_sales_21",
      date: "2026-08-21",
      amount: 18_000,
      kind: "forecast",
      label: "Поступления по продажам",
      source: commonSources.alfaAcquiring,
    },
    {
      id: "daily_sales_26",
      date: "2026-08-26",
      amount: 26_000,
      kind: "forecast",
      label: "Поступления по продажам",
      source: commonSources.alfaAcquiring,
    },
    {
      id: "daily_sales_01",
      date: "2026-09-01",
      amount: 30_000,
      kind: "forecast",
      label: "Поступления по продажам",
      source: commonSources.alfaAcquiring,
    },
    {
      id: "daily_sales_05",
      date: "2026-09-05",
      amount: 22_000,
      kind: "forecast",
      label: "Поступления по продажам",
      source: commonSources.alfaAcquiring,
    },
  ];
}

export function createEnvelopes(profileId: IndustryProfileId = "horeca"): Envelope[] {
  const fixture = getProfileFinanceFixture(profileId);
  const committed = fixture.envelopes.reduce((sum, envelope) => sum + envelope.amount, 0);
  const free = fixture.currentAccountsTotal - committed;

  return [
    ...fixture.envelopes.map((item) => ({
      id: item.id,
      title: item.title,
      targetAmount: item.amount,
      protectedAmount: item.amount,
      dueLabel: item.dueLabel,
      obligationIds: [item.obligationId],
      mode: "logical_only" as const,
      statusLabel: "Обеспечен",
    })),
    {
      id: "env_reserve",
      title: "Страховой запас",
      targetAmount: 60_000,
      protectedAmount: 18_000,
      dueLabel: "формируется",
      obligationIds: [],
      mode: "logical_only",
      statusLabel: "В работе",
    },
    {
      id: "env_free",
      title: "Свободные деньги",
      targetAmount: free,
      protectedAmount: free,
      dueLabel: "доступно сейчас",
      obligationIds: [],
      mode: "logical_only",
      statusLabel: "Можно использовать",
    },
  ];
}

export function createInitialAuditTrail(profileId: IndustryProfileId): AuditEntry[] {
  return [
    {
      id: "audit_start",
      at: DEMO_NOW,
      title: "Запущен контур Метронома",
      details: `Профиль ${profileId} готов к первой финансовой сборке.`,
    },
  ];
}

export function createInitialState(profileId: IndustryProfileId): DemoState {
  const fixture = getProfileFinanceFixture(profileId);
  const obligations = createBaseObligations(profileId);
  const currentAccountsTotal = fixture.currentAccountsTotal;
  const committedTotal = calculateTotalCommitted(obligations);
  const safeToSpend = calculateSafeToSpend(currentAccountsTotal, committedTotal);

  return {
    schemaVersion: 1,
    industryProfileId: profileId,
    providerMode: DEFAULT_PROVIDER_MODE,
    scenarioId: "p0_first_assembly",
    currentStep: "profile_picker",
    stepHistory: [],
    businessStatus: "needs_clarification",
    loginStatus: "idle",
    connectedSources: createInitialConnectedSources(),
    obligations,
    cashEvents: createCashEvents(profileId),
    envelopes: createEnvelopes(profileId),
    reserveRule: {
      currentAmount: 18_000,
      targetAmount: 60_000,
      percentOfFreeInflows: 7,
      dailyCap: 5_000,
      minimumSafeToSpend: 60_000,
      mode: null,
      status: "idle",
    },
    preparedAction: null,
    clarificationChoice: null,
    clarificationApplied: false,
    completedEvents: [],
    currentAccountsTotal,
    committedTotal,
    safeToSpend,
    campaignCommittedSlice: fixture.campaignCommittedSlice,
    forecastHorizonDays: 30,
    processingIndex: 0,
    lastRecalculatedAt: DEMO_NOW,
    recalculationHistory: [
      {
        at: DEMO_NOW,
        reason: "Инициализация демо",
        safeToSpend,
        committedTotal,
      },
    ],
    auditTrail: createInitialAuditTrail(profileId),
    selectedEnvelopeId: "env_rent_payroll",
    llmExplanation: null,
    llmExplanationSource: null,
    featureToast: null,
  };
}
