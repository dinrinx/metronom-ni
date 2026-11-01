export type Money = number;

export type IndustryProfileId = "horeca" | "beauty" | "retail";

export type ProviderMode = "mock" | "live" | "auto";

export type BusinessStatus = "ok" | "risk" | "needs_clarification";

export type SourceType =
  | "bank_operation"
  | "contract"
  | "invoice"
  | "tax"
  | "payroll"
  | "crowdfunding"
  | "crm"
  | "cashbox"
  | "inventory"
  | "calendar"
  | "user_confirmation";

export type ConnectedSourceId =
  | "alfa_account"
  | "alfa_acquiring"
  | "alfa_sbp"
  | "multibank"
  | "documents"
  | "industry_ops";

export type DemoStepId =
  | "profile_picker"
  | "login"
  | "home_entry"
  | "intro"
  | "sources"
  | "processing"
  | "found"
  | "clarification"
  | "safe_to_spend"
  | "how_calculated"
  | "envelopes"
  | "envelope_detail"
  | "reserve_rule"
  | "reserve_format"
  | "transfer_confirm"
  | "rule_active"
  | "risk_detail"
  | "risk_one_action"
  | "risk_compare"
  | "risk_done"
  | "risk_bridge"
  | "invoice_new"
  | "invoice_clarify"
  | "invoice_legal"
  | "invoice_draft"
  | "invoice_safe_date"
  | "invoice_done"
  | "backers_progress"
  | "backers_done"
  | "backers_growth"
  | "invest_prompt"
  | "invest_variants"
  | "invest_plan"
  | "fundraise_intro"
  | "fundraise_recommend"
  | "fundraise_compare"
  | "credit_history_unlock"
  | "credit_history_products";

export type ObligationCategory =
  | "rent"
  | "payroll"
  | "tax"
  | "supplier"
  | "backer"
  | "other";

export type ObligationStatus =
  | "confirmed"
  | "ambiguous"
  | "completed"
  | "cancelled";

export type ObligationPriority = "critical" | "important" | "optional";

export type ActionStatus =
  | "idle"
  | "prepared"
  | "awaiting_confirmation"
  | "confirmed"
  | "completed"
  | "cancelled";

export type ReserveMode = "logical" | "separate_account";

export type ProposedActionType =
  | "set_reserve_rule"
  | "draft_transfer"
  | "reschedule"
  | "draft_message"
  | "use_reserve"
  | "offer_overdraft"
  | "split_purchase";

export type ProcessingTaskId =
  | "contracts"
  | "invoices"
  | "calendar"
  | "ambiguity"
  | "free_cash";

export type SourceRef = {
  id: string;
  type: SourceType;
  title: string;
  capturedAt: string;
};

export type Obligation = {
  id: string;
  category: ObligationCategory;
  title: string;
  amount: Money;
  dueDate: string | null;
  status: ObligationStatus;
  priority: ObligationPriority;
  sourceSummary: string;
  sources: SourceRef[];
};

export type CashEvent = {
  id: string;
  date: string;
  amount: Money;
  kind: "actual" | "forecast";
  label: string;
  source: SourceRef;
};

export type Envelope = {
  id: string;
  title: string;
  targetAmount: Money;
  protectedAmount: Money;
  dueLabel: string;
  obligationIds: string[];
  mode: ReserveMode | "logical_only";
  statusLabel: string;
};

export type ProposedAction = {
  id: string;
  type: ProposedActionType;
  title: string;
  rationale: string;
  requiresConfirmation: boolean;
  reserveMode?: ReserveMode;
  transferAmount?: Money;
  impact: {
    risk: number;
    cost: Money;
    debtLoad: Money;
    businessImpact: number;
    projectedMinimumBalance: Money;
  };
};

export type ReserveRule = {
  currentAmount: Money;
  targetAmount: Money;
  percentOfFreeInflows: number;
  dailyCap: Money;
  minimumSafeToSpend: Money;
  mode: ReserveMode | null;
  status: ActionStatus;
};

export type RecalculationEntry = {
  at: string;
  reason: string;
  safeToSpend: Money;
  committedTotal: Money;
};

export type AuditEntry = {
  id: string;
  at: string;
  title: string;
  details: string;
};

export type ProcessingTask = {
  id: ProcessingTaskId;
  label: string;
  hint: string;
};

export type IndustryProfile = {
  id: IndustryProfileId;
  ownerName: string;
  ownerInitial: string;
  businessLabel: string;
  businessShortLabel: string;
  demoLogin: string;
  demoPassword: string;
  legalForm: string;
  campaignRaised: string;
  campaignBackers: number;
  campaignRewards: string;
  operationalSignalLabel: string;
  sourceLabels: string[];
  inventoryLabel: string;
  investmentPurpose: string;
  demandDropLabel: string;
  preparedActionLabel: string;
  rewardLabel: string;
  campaignTitle: string;
  industryMetricLabel: string;
  industryMetricValue: string;
  sourceHeading: string;
  sourceSubheading: string;
  inventoryRiskCopy: string;
  opSource: {
    title: string;
    action: string;
  };
  supplierEnvelope: string;
  rentEnvelope: string;
  riskCause: string;
  rewardFulfilled: string;
  investSubject: string;
  invoiceSubject: string;
  fact: string;
  forecast: string;
  kpi: {
    label: string;
    value: string;
  };
};

export type ConnectedSourceState = Record<ConnectedSourceId, boolean>;

export type DemoState = {
  schemaVersion: number;
  industryProfileId: IndustryProfileId;
  providerMode: ProviderMode;
  scenarioId: "p0_first_assembly";
  currentStep: DemoStepId;
  stepHistory: DemoStepId[];
  businessStatus: BusinessStatus;
  loginStatus: "idle" | "error" | "success";
  connectedSources: ConnectedSourceState;
  obligations: Obligation[];
  cashEvents: CashEvent[];
  envelopes: Envelope[];
  reserveRule: ReserveRule;
  preparedAction: ProposedAction | null;
  clarificationChoice: string | null;
  clarificationApplied: boolean;
  completedEvents: string[];
  currentAccountsTotal: Money;
  committedTotal: Money;
  safeToSpend: Money;
  campaignCommittedSlice: Money;
  forecastHorizonDays: number;
  processingIndex: number;
  lastRecalculatedAt: string;
  recalculationHistory: RecalculationEntry[];
  auditTrail: AuditEntry[];
  selectedEnvelopeId: string;
  llmExplanation: string | null;
  llmExplanationSource: "fallback" | "live" | null;
  featureToast: string | null;
};
