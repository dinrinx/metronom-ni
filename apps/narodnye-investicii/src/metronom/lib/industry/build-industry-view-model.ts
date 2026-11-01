import { build30DayPlan } from "@m/domain/finance/build-30-day-plan";
import type {
  CashEvent,
  ConnectedSourceId,
  DemoState,
  Envelope,
  IndustryProfile,
  Obligation,
} from "@m/domain/types";
import { formatCompactRuDate, formatMoney, formatRuDate } from "@m/lib/formatting";
import { INDUSTRY_PROFILES } from "@m/lib/industry/profiles";

export type SourceCardViewModel = {
  id: ConnectedSourceId;
  title: string;
  sub: string;
  connected: boolean;
  actionLabel?: string;
};

export type EnvelopeDetailViewModel = {
  title: string;
  total: string;
  status: string;
  rows: Array<{
    label: string;
    amount: string;
    due: string;
  }>;
  sourceCopy: string;
  incomeCopy: string;
  note: string;
};

function obligationsForEnvelope(obligations: Obligation[], envelope: Envelope): Obligation[] {
  return obligations.filter((obligation) => envelope.obligationIds.includes(obligation.id));
}

function sourceSummary(obligations: Obligation[]): string {
  return obligations.map((obligation) => obligation.sourceSummary).join(" · ");
}

function buildEnvelopeDetail(state: DemoState, profile: IndustryProfile): EnvelopeDetailViewModel {
  const relevantEnvelope =
    state.envelopes.find((item) => item.id === state.selectedEnvelopeId) ??
    state.envelopes[0];
  if (relevantEnvelope === undefined) {
    throw new Error("Envelope fixtures are missing.");
  }
  const envelopeObligations = obligationsForEnvelope(state.obligations, relevantEnvelope);

  return {
    title: `Конверт «${relevantEnvelope.title}»`,
    total: formatMoney(relevantEnvelope.protectedAmount),
    status: relevantEnvelope.statusLabel === "Обеспечен" ? "Обеспечен полностью" : relevantEnvelope.statusLabel,
    rows: envelopeObligations.map((obligation) => ({
      label: obligation.title,
      amount: formatMoney(obligation.amount),
      due: obligation.dueDate ? formatRuDate(obligation.dueDate) : "нужно уточнить",
    })),
    sourceCopy: sourceSummary(envelopeObligations),
    incomeCopy:
      relevantEnvelope.id === "env_backers"
        ? `Учтены ${profile.forecast} и исполнение обещаний по мере того, как ${profile.rewardFulfilled.toLowerCase()}.`
        : `Учтены ${profile.forecast} и текущий операционный ритм бизнеса.`,
    note:
      relevantEnvelope.id === "env_backers"
        ? `Освобождается по мере того, как ${profile.rewardFulfilled.toLowerCase()}.`
        : "Освобождается после проведения платежей.",
  };
}

function nextIndustrySource(profile: IndustryProfile): string {
  return profile.sourceLabels.join(", ");
}

export function buildIndustryViewModel(state: DemoState) {
  const profile = INDUSTRY_PROFILES[state.industryProfileId];
  const plan = build30DayPlan({
    startDate: "2026-08-11",
    openingBalance: state.currentAccountsTotal,
    cashEvents: state.cashEvents,
    obligations: state.obligations,
    days: state.forecastHorizonDays,
  });

  const sourceCards: SourceCardViewModel[] = [
    {
      id: "alfa_account",
      title: "Счёт, эквайринг и СБП банка",
      sub: "Подключено автоматически",
      connected: state.connectedSources.alfa_account && state.connectedSources.alfa_acquiring && state.connectedSources.alfa_sbp,
    },
    {
      id: "multibank",
      title: "Другой банк / Мультибанк",
      sub: "Покажет остатки в других банках",
      connected: state.connectedSources.multibank,
    },
    {
      id: "documents",
      title: "Договоры, счета, налоги, календарь выплат",
      sub: "Загружу документы и регулярные обязательства",
      connected: state.connectedSources.documents,
    },
    {
      id: "industry_ops",
      title: profile.opSource.title,
      sub: profile.sourceSubheading,
      connected: state.connectedSources.industry_ops,
      actionLabel: profile.opSource.action,
    },
  ];

  const foundRows = state.obligations.map((obligation) => ({
    label: obligation.title,
    meta:
      obligation.id === "supplier" && !state.clarificationApplied
        ? "нужно уточнить"
        : formatMoney(obligation.amount),
  }));

  const envelopeDetail = buildEnvelopeDetail(state, profile);
  const supplierObligation = state.obligations.find((obligation) => obligation.id === "supplier");
  const supplierDueCopy =
    supplierObligation?.dueDate !== null && supplierObligation?.dueDate !== undefined
      ? formatRuDate(supplierObligation.dueDate)
      : "нужна дата оплаты";

  const calcSources = [
    `${formatMoney(state.currentAccountsTotal)} — факт: ${profile.fact}`,
    `${formatMoney(state.committedTotal)} — прогноз: ${profile.forecast}`,
    `${formatMoney(state.campaignCommittedSlice)} — кампания и ${profile.rewardFulfilled.toLowerCase()}`,
    `${formatMoney(supplierObligation?.amount ?? 0)} — ${profile.invoiceSubject}, ${supplierDueCopy}`,
  ];

  return {
    profile,
    plan,
    sourceCards,
    foundRows,
    envelopeDetail,
    calcSources,
    allRequiredSourcesConnected: sourceCards.every((card) => card.connected),
    activityLine:
      state.businessStatus === "risk"
        ? profile.riskCause
        : state.businessStatus === "ok"
        ? "План обновлён 2 минуты назад · учтена дата поставщика 18 августа"
        : "Нужно уточнение · договор поставщика влияет на план",
    industrySummary: nextIndustrySource(profile),
    formattedLastUpdated: formatCompactRuDate(state.lastRecalculatedAt.slice(0, 10)),
  };
}
