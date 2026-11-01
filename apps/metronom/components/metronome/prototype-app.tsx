"use client";

import type { CSSProperties } from "react";
import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BackIcon,
  BankIcon,
  BeautySparkIcon,
  BellIcon,
  CashboxIcon,
  ChatOutlineIcon,
  CoffeeCupIcon,
  ClockOutlineIcon,
  ChevronRightIcon,
  DocumentIcon,
  FolderIcon,
  GridOutlineIcon,
  HomeOutlineIcon,
  InfoIcon,
  LeaseIcon,
  LockIcon,
  MetronomeGlyph,
  NotificationDot,
  ShieldCheckIcon,
  StorefrontIcon,
  SwapHorizontalIcon,
  TickSquareIcon,
  WalletOutlineIcon,
} from "@/components/metronome/icons";
import { useDemoStore } from "@/lib/demo/store";
import type { DemoStoreState } from "@/lib/demo/store";
import type { DemoAction } from "@/domain/events/reducer";
import {
  ALT_CREDIT_HISTORY_ENTRY,
  ALT_CREDIT_HISTORY_EXPLANATION,
  ALT_CREDIT_HISTORY_HISTORY_ROWS,
  ALT_CREDIT_HISTORY_PRODUCTS,
  type AlternativeCreditHistoryProductIcon,
  type AlternativeCreditHistoryStep,
} from "@/lib/demo/alternative-credit-history";
import {
  DAILY_CYCLE_ENTRY_CARDS,
  DAILY_CYCLE_SCENARIOS,
  type DailyCycleScenarioStep,
  type ScenarioRow,
} from "@/lib/demo/daily-cycle-scenarios";
import { buildIndustryViewModel } from "@/lib/industry/build-industry-view-model";
import { CLARIFY_OPTIONS, PROCESSING_TASKS } from "@/lib/demo/fixtures";
import { FALLBACK_EXPLANATIONS } from "@/lib/demo/fallback-responses";
import { formatCompactRuDateTime, formatMoney, formatRuDate } from "@/lib/formatting";
import { INDUSTRY_PROFILES } from "@/lib/industry/profiles";
import { getPathForStep, getStepForPath } from "@/lib/navigation/step-paths";
import type { ConnectedSourceId, DemoStepId, IndustryProfileId, ReserveMode } from "@/domain/types";

type ScreenProps = {
  state: DemoStoreState;
  viewModel: ReturnType<typeof buildIndustryViewModel>;
  goTo: (step: DemoStepId, pushHistory?: boolean) => void;
  goBack: () => void;
  connectSource: (sourceId: ConnectedSourceId) => void;
  pickProfile: (profileId: IndustryProfileId) => void;
  setReserveMode: (mode: ReserveMode) => void;
  dispatchRouteAction: (action: DemoAction) => void;
  showToast: (message: string | null) => void;
};

function isAlternativeCreditHistoryStep(step: DemoStepId): step is AlternativeCreditHistoryStep {
  return step === "credit_history_unlock" || step === "credit_history_products";
}

function IndustryAvatar({ profileId, className = "profile-avatar" }: { profileId: IndustryProfileId; className?: string }) {
  const icon =
    profileId === "horeca" ? (
      <CoffeeCupIcon />
    ) : profileId === "beauty" ? (
      <BeautySparkIcon />
    ) : (
      <StorefrontIcon />
    );

  return <span className={className}>{icon}</span>;
}

function MobileButton({
  label,
  onClick,
  variant = "dark",
  disabled = false,
  type = "button",
}: {
  label: string;
  onClick: () => void;
  variant?: "dark" | "light";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      className={`cta-button ${variant === "light" ? "cta-button-light" : ""}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {label}
    </button>
  );
}

function IntroLoadingCheck({ done }: { done: boolean }) {
  return (
    <span className={`intro-check ${done ? "intro-check-ready" : "intro-check-loading"}`} aria-hidden="true">
      <span className="intro-check-spinner" />
      <svg className="intro-check-icon" viewBox="0 0 20 20" fill="none">
        <path d="m5.8 10.5 2.7 2.9 5.8-7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function BackHeader({ title, onBack }: { title?: string; onBack: () => void }) {
  return (
    <div className="screen-back-row">
      <button aria-label="Назад" className="icon-button" onClick={onBack} type="button">
        <BackIcon />
      </button>
      {title ? <span className="screen-back-title">{title}</span> : null}
    </div>
  );
}

function useAutoProcessing(step: DemoStepId, processingIndex: number, dispatchRouteAction: (action: DemoAction) => void) {
  const advanceProcessing = useEffectEvent(() => {
    dispatchRouteAction({ type: "advance_processing" });
  });

  useEffect(() => {
    if (step !== "processing") return undefined;
    if (processingIndex >= PROCESSING_TASKS.length - 1) return undefined;

    const timer = window.setTimeout(() => {
      advanceProcessing();
    }, 920);

    return () => window.clearTimeout(timer);
  }, [processingIndex, step]);
}

function useLiveExplanation(
  step: DemoStepId,
  state: DemoStoreState,
  dispatch: DemoStoreState["dispatch"],
) {
  useEffect(() => {
    if (!state.clarificationApplied) return;
    if (step !== "safe_to_spend" && step !== "how_calculated") return;
    if (state.providerMode === "mock" || state.llmExplanationSource === "live") return;

    let cancelled = false;

    void fetch("/api/gigachat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: state.providerMode,
        kind: "explainDecision",
        payload: {
          industryProfileId: state.industryProfileId,
          safeToSpend: state.safeToSpend,
          committedTotal: state.committedTotal,
          currentAccountsTotal: state.currentAccountsTotal,
          clarificationDate: state.clarificationChoice ?? "2026-08-18",
        },
      }),
    })
      .then((response) => response.json())
      .then((payload: unknown) => {
        if (cancelled || typeof payload !== "object" || payload === null) return;
        const record = payload as { ok?: unknown; explanation?: unknown; source?: unknown };
        if (record.ok === true && typeof record.explanation === "string" && record.source === "live") {
          dispatch({ type: "set_llm_explanation", text: record.explanation, source: "live" });
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [
    dispatch,
    state.clarificationApplied,
    state.clarificationChoice,
    state.committedTotal,
    state.currentAccountsTotal,
    state.industryProfileId,
    state.llmExplanationSource,
    state.providerMode,
    state.safeToSpend,
    step,
  ]);
}

function ProfilePickerScreen({ state, pickProfile }: Pick<ScreenProps, "state" | "pickProfile">) {
  return (
    <div className="screen-body profile-screen">
      <div className="screen-hero centered">
        <span className="eyebrow">Демо-режим</span>
        <h1 className="screen-title">Выбери профиль</h1>
        <p className="screen-copy profile-screen-copy">Один и тот же Метроном в трёх отраслях. Данные меняются, логика одна.</p>
      </div>
      <div className="stack gap-md">
        {(Object.keys(INDUSTRY_PROFILES) as IndustryProfileId[]).map((profileId) => {
          const profile = INDUSTRY_PROFILES[profileId];
          return (
            <button
              key={profileId}
              className={`choice-card ${state.industryProfileId === profileId ? "choice-card-active" : ""}`}
              data-testid={`profile-card-${profileId}`}
              onClick={() => pickProfile(profileId)}
              type="button"
            >
              <IndustryAvatar className="choice-avatar" profileId={profileId} />
              <span className="choice-body">
                <span className="choice-title">{profile.businessLabel}</span>
                <span className="choice-subtitle">{profile.businessShortLabel}</span>
              </span>
              <ChevronRightIcon />
            </button>
          );
        })}
      </div>
      <div className="screen-footer-note">
        <InfoIcon />
        <span>Служебный экран прототипа. В рабочем продукте пользователь попадёт сразу на вход.</span>
      </div>
    </div>
  );
}

function LoginScreen({ state, goTo, dispatchRouteAction }: Pick<ScreenProps, "state" | "goTo" | "dispatchRouteAction">) {
  const profile = INDUSTRY_PROFILES[state.industryProfileId];
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);

  const submitLogin = () => {
    const isValid = login.trim() === profile.demoLogin && password === profile.demoPassword;
    if (!isValid) {
      setHasError(true);
      return;
    }

    setHasError(false);
    dispatchRouteAction({ type: "submit_login" });
  };

  return (
    <div className="screen-body">
      <BackHeader onBack={() => goTo("profile_picker")} />
      <div className="stack gap-lg centered pad-top-lg">
        <IndustryAvatar className="profile-avatar large" profileId={profile.id} />
        <div className="centered">
          <h1 className="screen-title compact">Привет, {profile.ownerName}</h1>
          <p className="screen-copy">{profile.businessLabel}</p>
        </div>
        <p className="screen-copy centered narrow">Введи логин и пароль от Альфа-Бизнес, чтобы открыть Метроном.</p>
      </div>

      <div className="stack gap-sm">
        <div className="field-card">
          <span className="field-label">Логин</span>
          <input
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="username"
            className="field-input"
            data-testid="login-input"
            inputMode="email"
            onChange={(event) => {
              setLogin(event.target.value);
              if (hasError) setHasError(false);
            }}
            placeholder=""
            type="email"
            value={login}
          />
        </div>
        <div className={`field-card ${hasError ? "field-card-error" : ""}`}>
          <span className={`field-label ${hasError ? "field-label-error" : ""}`}>Пароль</span>
          <input
            autoCapitalize="none"
            autoComplete="current-password"
            className="field-input field-input-password"
            data-testid="password-input"
            onChange={(event) => {
              setPassword(event.target.value);
              if (hasError) setHasError(false);
            }}
            placeholder=""
            type="password"
            value={password}
          />
        </div>
        {hasError ? (
          <div className="inline-error">Неверный логин или пароль. Используй закреплённые demo-данные для этого профиля.</div>
        ) : null}
      </div>

      <div className="stack gap-sm push-bottom">
        <div data-testid="login-submit">
          <MobileButton
            disabled={login.trim().length === 0 || password.length === 0}
            label={hasError ? "Повторить вход" : "Войти"}
            onClick={submitLogin}
          />
        </div>
      </div>
    </div>
  );
}

function HomeEntryScreen({
  state,
  viewModel,
  goTo,
  showToast,
}: Pick<ScreenProps, "state" | "viewModel" | "goTo" | "showToast">) {
  const { profile } = viewModel;
  return (
    <div className="screen-scroll">
      <div className="home-header">
        <IndustryAvatar profileId={profile.id} />
        <div className="home-header-copy">
          <span className="muted">Привет, {profile.ownerName}</span>
          <strong>{profile.businessLabel}</strong>
          <span className="status-chip green">{profile.legalForm}</span>
        </div>
        <button className="icon-button soft" onClick={() => showToast("Уведомления в P0 показывают только события Метронома.")} type="button">
          <BellIcon />
          <NotificationDot />
        </button>
      </div>

      <section className="home-balance">
        <div className="row-between">
          <span className="muted">На всех счетах</span>
          <span className="pill-muted">Мультибанк</span>
        </div>
        <div className="hero-amount">{formatMoney(state.currentAccountsTotal)}</div>
        <button className="teaser-lock" onClick={() => goTo("intro")} type="button">
          <LockIcon />
          <span>
            <strong>Действительно свободно: ••••• ₽</strong>
            <small>Открой Метроном, чтобы узнать</small>
          </span>
        </button>
      </section>

      <div className="quick-actions">
        {["Платежи", "СБП", "Счета", "История"].map((label) => (
          <button key={label} className="quick-action-card" onClick={() => showToast(`Раздел «${label}» не участвует в P0-flow.`)} type="button">
            {label}
          </button>
        ))}
      </div>

      <section className="metronome-card">
        <div className="metronome-brand">
          <MetronomeGlyph color="#FFFFFF" />
          <span>Метроном</span>
          <span className="brand-pill">AI-агент</span>
        </div>
        <h2 className="metronome-card-title">Кампания завершена. Пора обновить сводку</h2>
        <p className="metronome-card-copy">Найдём обязательства и покажем, сколько денег действительно свободно.</p>
        <div data-testid="open-metronome">
          <MobileButton label="Открыть Метроном →" onClick={() => goTo("intro")} variant="light" />
        </div>
      </section>

      <section className="fact-card fact-card-campaign">
        <div className="row-between fact-card-head">
          <span className="fact-card-kicker">Народные инвестиции</span>
          <span className="status-chip green campaign-chip">Кампания завершена</span>
        </div>
        <strong className="fact-card-title">{profile.campaignTitle}</strong>
        <div className="progress-track">
          <span className="progress-fill" />
        </div>
        <div className="row-between muted fact-card-foot">
          <span>Собрано {profile.campaignRaised} · {profile.campaignBackers} бэкеров</span>
          <strong>100%</strong>
        </div>
      </section>

      <button className="logout-link" onClick={() => goTo("profile_picker", false)} type="button">
        Выйти из аккаунта
      </button>
    </div>
  );
}

function IntroScreen({ goTo, viewModel }: Pick<ScreenProps, "goTo" | "viewModel">) {
  const { profile } = viewModel;
  const campaignRows = [
    ["Сумма сбора", profile.campaignRaised],
    ["Награды (rewards)", profile.campaignRewards],
    ["Бэкеры", String(profile.campaignBackers)],
  ] as const;
  const businessRows = [
    ["Сроки исполнения", "подтверждены"],
    ["Себестоимость", "подтверждена"],
  ] as const;
  const totalRows = campaignRows.length + businessRows.length;
  const [readyCount, setReadyCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer = 0;

    const advance = () => {
      timer = window.setTimeout(() => {
        if (cancelled) return;
        setReadyCount((current) => {
          const next = Math.min(current + 1, totalRows);
          if (next < totalRows) {
            advance();
          }
          return next;
        });
      }, 760);
    };

    advance();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [totalRows]);

  return (
    <div className="screen-body">
      <BackHeader onBack={() => goTo("home_entry", false)} />
      <div className="brand-row">
        <span className="brand-glyph"><MetronomeGlyph color="#ef3124" /></span>
        <span className="brand-copy">
          <strong>Метроном</strong>
          <small>Держу бизнес в ритме</small>
        </span>
      </div>

      <h1 className="screen-title">AI-агент соберёт сводку</h1>
      <p className="screen-copy">Часть данных уже у меня из «Народных инвестиций», и осталось подключить счета и документы для {profile.businessLabel.toLowerCase()}.</p>

      <div className="stack gap-sm">
        <div className="fact-list-card intro-fact-card">
          <div className="eyebrow muted">Из «Народных инвестиций»</div>
          {campaignRows.map(([label, value], index) => (
            <div className="fact-list-row" key={label}>
              <IntroLoadingCheck done={readyCount > index} />
              <span className="muted">{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>

        <div className="fact-list-card intro-fact-card">
          <div className="eyebrow muted">Отдельно сверю у вас</div>
          {businessRows.map(([label, value], index) => (
            <div className="fact-list-row" key={label}>
              <IntroLoadingCheck done={readyCount > campaignRows.length + index} />
              <span className="muted">{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="screen-footer-note">
        <InfoIcon />
        <span>Ничего не додумываю: если данные неоднозначны, обязательно спрошу.</span>
      </div>

      <div className="push-bottom">
        <div data-testid="go-sources">
          <MobileButton disabled={readyCount < totalRows} label="Подключить источники →" onClick={() => goTo("sources")} />
        </div>
      </div>
    </div>
  );
}

function SourceIcon({ id }: { id: ConnectedSourceId }) {
  if (id === "alfa_account" || id === "multibank") return <BankIcon />;
  if (id === "industry_ops") return <CashboxIcon />;
  return <FolderIcon />;
}

function SourcesScreen({
  viewModel,
  connectSource,
  goTo,
}: Pick<ScreenProps, "viewModel" | "connectSource" | "goTo">) {
  return (
    <div className="screen-body sources-screen">
      <div className="sources-heading-row">
        <button aria-label="Назад" className="icon-button sources-back-button" onClick={() => goTo("intro", false)} type="button">
          <BackIcon />
        </button>
        <h1 className="screen-title compact">Откуда берём картину бизнеса</h1>
      </div>
      <p className="screen-copy">Чем больше источников, тем точнее модель обязательств и Safe-to-Spend.</p>

      <div className="stack gap-sm">
        {viewModel.sourceCards.map((card) => (
          <div className={`source-card ${card.connected ? "source-card-connected" : ""}`} key={card.id}>
            <SourceIcon id={card.id} />
            <span className="source-copy">
              <strong>{card.title}</strong>
              <small>{card.sub}</small>
            </span>
            <button
              className={`connect-pill ${card.connected ? "connect-pill-connected" : ""}`}
              data-testid={`connect-${card.id}`}
              onClick={() => connectSource(card.id)}
              type="button"
            >
              {card.connected ? "Подключено" : (card.actionLabel ?? "Подключить")}
            </button>
          </div>
        ))}
      </div>

      <div className="screen-footer-note">
        <InfoIcon />
        <span>Счёт, эквайринг и СБП Альфы подключаются автоматически. Остальное включается по одному действию.</span>
      </div>

      <div className="push-bottom">
        <div data-testid="collect-obligations">
          <MobileButton
            disabled={!viewModel.allRequiredSourcesConnected}
            label="Собрать модель обязательств →"
            onClick={() => goTo("processing")}
          />
        </div>
      </div>
    </div>
  );
}

function ProcessingStatusIcon({ done }: { done: boolean }) {
  return (
    <span className={`processing-check ${done ? "processing-check-done" : ""}`}>
      {done ? (
        <svg className="processing-check-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="m5.8 10.5 2.7 2.9 5.8-7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <span className="processing-check-pending-dot" aria-hidden="true" />
      )}
    </span>
  );
}

function FoundLoadingDots() {
  return (
    <span className="found-loading-dots" aria-hidden="true">
      <span className="found-loading-dot" />
      <span className="found-loading-dot" />
      <span className="found-loading-dot" />
    </span>
  );
}

function ClarificationThinkingCard() {
  return (
    <div className="info-card clarification-thinking-card">
      <span className="clarification-thinking-badge" aria-hidden="true">
        <MetronomeGlyph color="#1D1D1B" armColor="#1D1D1B" />
      </span>
      <span>
        <strong>Сверяю выбор с планом</strong>
        <small>Агент обновляет модель обязательств</small>
      </span>
      <FoundLoadingDots />
    </div>
  );
}

function ScenarioCheckBadge({ tone }: { tone: "green" | "dark" }) {
  return (
    <span className={`scenario-check-badge scenario-check-badge-${tone} ${tone === "green" ? "scenario-check-badge-animated" : ""}`}>
      {tone === "green" ? <span className="scenario-check-loader" aria-hidden="true" /> : null}
      <svg className="scenario-check-mark" viewBox="0 0 38 30" aria-hidden="true">
        <path d="M3 15.5 13.5 26 35 4" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function ScenarioStatusBadge({ label, tone }: { label: string; tone: "green" | "amber" | "dark" | "red" }) {
  return (
    <span className={`scenario-status-badge scenario-status-badge-${tone} align-start`}>
      <span className="scenario-status-badge-dot" />
      <span>{label}</span>
    </span>
  );
}

function ScenarioRowList({ rows, className }: { rows: ScenarioRow[]; className?: string }) {
  return (
    <div className={`scenario-rows-card ${className ?? ""}`.trim()}>
      {rows.map((row) => (
        <div className="scenario-row" key={`${row.label}-${row.value ?? ""}`}>
          {row.tick ? (
            <span className="scenario-row-tick">
              <TickSquareIcon />
            </span>
          ) : null}
          <span className="scenario-row-copy">
            <span className="scenario-row-label">{row.label}</span>
            {row.sub ? <span className="scenario-row-sub">{row.sub}</span> : null}
          </span>
          {row.value ? <span className={`scenario-row-value ${row.valueTone ? `scenario-row-value-${row.valueTone}` : ""}`}>{row.value}</span> : null}
        </div>
      ))}
    </div>
  );
}

type ScenarioCompareOutcome = {
  cta: {
    label: string;
    action: { type: "step"; step: DemoStepId } | { type: "toast"; message: string };
    requiresChoice?: boolean;
  };
  warning: string | null;
};

function getScenarioCompareOutcome(step: DailyCycleScenarioStep, compareId: string | null) {
  if (step === "invest_variants") {
    switch (compareId) {
      case "full_buy":
        return {
          cta: { label: "Зафиксировать рискованный заказ на 96 000 ₽", action: { type: "toast" as const, message: "Если закупить на 96 000 ₽ уже 12 августа 2026 года, свободный буфер упадёт до 21 000 ₽ и Метроном пометит план как рискованный." } },
          warning: "После закупки на 96 000 ₽ буфер почти исчезнет: аренда и зарплаты 20 августа 2026 года окажутся под давлением.",
        } satisfies ScenarioCompareOutcome;
      case "delay_buy":
        return {
          cta: { label: "Отложить закупку на 5 дней", action: { type: "toast" as const, message: "Закупка отложена до 17 августа 2026 года: Метроном перепроверит спрос и предложит вернуться к заказу после новой сверки." } },
          warning: "Если отложить закупку, запуск сезонного меню сдвинется и можно потерять часть спроса на ближайших выходных.",
        } satisfies ScenarioCompareOutcome;
      case "smart_buy":
      default:
        return {
          cta: { label: "Подготовить заказ на 68 000 ₽", action: { type: "step" as const, step: "invest_plan" } },
          warning: null,
        } satisfies ScenarioCompareOutcome;
    }
  }

  if (step === "risk_compare") {
    switch (compareId) {
      case "cut_order":
        return {
          cta: { label: "Подготовить сокращение заказа на 30%", action: { type: "toast" as const, message: "Зафиксирован запасной сценарий: сокращение заказа сэкономит 26 000 ₽, но к концу августа 2026 года может не хватить материалов." } },
          warning: "Сокращение заказа снизит подушку сейчас, но создаст риск нехватки материалов к концу месяца.",
        } satisfies ScenarioCompareOutcome;
      case "use_reserve":
        return {
          cta: { label: "Использовать страховой запас", action: { type: "toast" as const, message: "Если использовать страховой запас сейчас, резерв обнулится и будет восстанавливаться примерно до 2 сентября 2026 года." } },
          warning: "Использование страхового запаса обнулит резерв и на несколько недель оставит бизнес без защиты от следующего сбоя.",
        } satisfies ScenarioCompareOutcome;
      case "overdraft":
        return {
          cta: { label: "Подключить овердрафт Альфы", action: { type: "toast" as const, message: "Овердрафт доступен, но добавит платную долговую нагрузку уже в августе 2026 года при решаемой операционной ситуации." } },
          warning: "Овердрафт закроет разрыв, но добавит проценты и конкуренцию за деньги с арендой и ФОТ.",
        } satisfies ScenarioCompareOutcome;
      case "delay_supply":
      default:
        return {
          cta: { label: "Вернуться к рекомендации", action: { type: "step" as const, step: "risk_one_action" } },
          warning: null,
        } satisfies ScenarioCompareOutcome;
    }
  }

  return null;
}

function BottomNav({
  activeIndex,
  goTo,
  showToast,
}: Pick<ScreenProps, "goTo" | "showToast"> & { activeIndex: 0 | 3 }) {
  const items = [
    { label: "Главный", icon: <HomeOutlineIcon /> },
    { label: "История", icon: <ClockOutlineIcon /> },
    { label: "Платежи", icon: <WalletOutlineIcon /> },
    { label: "Витрина", icon: <GridOutlineIcon /> },
    { label: "Чаты", icon: <ChatOutlineIcon /> },
  ] as const;

  const handlePress = (index: number, label: string) => {
    if (index === 0) {
      if (activeIndex !== 0) {
        goTo("safe_to_spend");
      }
      return;
    }

    if (index === 3) {
      if (activeIndex !== 3) {
        showToast("Витрина продуктов откроется после формирования альтернативной кредитной истории.");
      }
      return;
    }

    showToast(`В финальном P0 активен только раздел «${label === "Главный" ? "Главный" : "Метроном"}».`);
  };

  return (
    <div className="bottom-nav">
      {items.map((item, index) => (
        <button
          key={item.label}
          className={`bottom-nav-item ${index === activeIndex ? "bottom-nav-item-active" : ""}`}
          onClick={() => handlePress(index, item.label)}
          type="button"
        >
          <span className="bottom-nav-icon">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

function AlternativeCreditHistoryProductIconGlyph({ icon }: { icon: AlternativeCreditHistoryProductIcon }) {
  switch (icon) {
    case "wallet":
      return <WalletOutlineIcon />;
    case "lease":
      return <LeaseIcon />;
    case "swap":
      return <SwapHorizontalIcon />;
    case "shield":
      return <ShieldCheckIcon />;
    default:
      return null;
  }
}

function ScenarioEntryCarousel({
  entries,
  goTo,
}: {
  entries: typeof DAILY_CYCLE_ENTRY_CARDS;
  goTo: (step: DemoStepId, pushHistory?: boolean) => void;
}) {
  return (
    <div
      className="scenario-entry-list"
      onWheel={(event) => {
        const node = event.currentTarget;
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
        event.preventDefault();
        node.scrollLeft += event.deltaY;
      }}
    >
      {entries.map((entry) => (
        <button
          key={entry.step}
          className={`scenario-entry-card scenario-entry-card-${entry.tone}`}
          onClick={() => goTo(entry.step)}
          type="button"
        >
          <span className="scenario-entry-copy">
            <span className="scenario-entry-title">{entry.title}</span>
            <span className="scenario-entry-sub">{entry.sub}</span>
          </span>
          <ChevronRightIcon />
        </button>
      ))}
    </div>
  );
}

function DailyCycleScenarioScreen({
  step,
  goTo,
  goBack,
  showToast,
}: Pick<ScreenProps, "goTo" | "goBack" | "showToast"> & { step: DailyCycleScenarioStep }) {
  const screen = DAILY_CYCLE_SCENARIOS[step];
  const [choice, setChoice] = useState<string | null>(null);
  const defaultCompareId = screen.compare?.find((variant) => variant.featured)?.id ?? screen.compare?.[0]?.id ?? null;
  const [selectedCompareId, setSelectedCompareId] = useState<string | null>(defaultCompareId);
  const compareOutcome = getScenarioCompareOutcome(step, selectedCompareId);
  const primaryAction = compareOutcome?.cta ?? screen.cta;
  const secondaryAction = screen.secondary;
  const usesPlainPreparedHeading = step === "fundraise_compare";

  const runAction = (action: { type: "step"; step: DemoStepId } | { type: "toast"; message: string }) => {
    if (action.type === "step") {
      goTo(action.step);
      return;
    }

    showToast(action.message);
  };

  const hasCenteredHeader = screen.align === "center";

  return (
    <div className={`screen-body scenario-screen scenario-screen-${step}`}>
      <BackHeader onBack={goBack} />
      {screen.badge ? <ScenarioStatusBadge label={screen.badge.label} tone={screen.badge.tone} /> : null}
      {screen.check ? <ScenarioCheckBadge tone={screen.check.tone} /> : null}
      <h1 className={`screen-title compact ${hasCenteredHeader ? "scenario-title-centered" : ""}`}>{screen.title}</h1>
      {screen.sub ? <p className={`screen-copy ${hasCenteredHeader ? "scenario-copy-centered" : ""}`}>{screen.sub}</p> : null}

      {screen.stat ? (
        <div className="scenario-stat-card">
          <div className="scenario-stat-value">{screen.stat.value}</div>
          <div className="scenario-stat-sub">{screen.stat.sub}</div>
          {screen.stat.progressWidth ? (
            <div className="scenario-stat-progress">
              <span className="scenario-stat-progress-fill" style={{ width: screen.stat.progressWidth }} />
            </div>
          ) : null}
        </div>
      ) : null}

      {screen.rows ? <ScenarioRowList rows={screen.rows} /> : null}

      {screen.actionCard && !usesPlainPreparedHeading ? (
        <div className={`scenario-action-card ${step === "backers_growth" ? "scenario-action-card-roomy" : ""}`}>
          <div className="scenario-action-kicker">Что подготовил Метроном</div>
          <div className="scenario-action-title">{screen.actionCard.title}</div>
          <div className="scenario-action-sub">{screen.actionCard.sub}</div>
        </div>
      ) : null}

      {usesPlainPreparedHeading ? <div className="scenario-plain-heading">Что подготовил Метроном</div> : null}

      {screen.choice ? (
        <div className="scenario-choice-card">
          <div className="scenario-choice-question">{screen.choice.question}</div>
          <div className="clarify-options">
            {screen.choice.options.map((option) => {
              const selected = choice === option.id;
              return (
                <button
                  key={option.id}
                  className={`clarify-option ${selected ? "clarify-option-active" : ""}`}
                  onClick={() => setChoice(option.id)}
                  type="button"
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {screen.legal ? (
        <div className="scenario-legal-card">
          <span className="scenario-legal-pill">
            <ShieldCheckIcon />
            <span>Проверено юристом-партнёром</span>
          </span>
          <p className="scenario-legal-copy">{screen.legal.text}</p>
          <div className="scenario-legal-actions">
            {screen.legal.actions.map((action) => (
              <button
                key={action.label}
                className={`scenario-inline-button ${action.variant === "primary" ? "scenario-inline-button-primary" : "scenario-inline-button-secondary"}`}
                onClick={() => runAction(action.action)}
                type="button"
              >
                {action.label}
              </button>
            ))}
          </div>
          <div className="scenario-legal-foot">
            <span>{screen.legal.footLeft}</span>
            <span>{screen.legal.footRight}</span>
          </div>
        </div>
      ) : null}

      {screen.draft ? (
        <div className="scenario-draft-card">
          <div className="scenario-draft-kicker">Черновик письма</div>
          <div className="scenario-draft-copy">{screen.draft.text}</div>
        </div>
      ) : null}

      {screen.compare ? (
        <div className="scenario-compare-list">
          {screen.compare.map((variant) => (
            <button
              key={variant.name}
              className={`scenario-compare-card ${
                (variant.id !== undefined && selectedCompareId === variant.id) || (variant.id === undefined && variant.featured)
                  ? "scenario-compare-card-featured"
                  : ""
              }`}
              onClick={() => {
                if (variant.id !== undefined) {
                  setSelectedCompareId(variant.id);
                }
              }}
              aria-pressed={variant.id !== undefined ? selectedCompareId === variant.id : variant.featured}
              type="button"
            >
              <div className="scenario-compare-head">
                <span className="scenario-compare-name">{variant.name}</span>
                <span className={`scenario-compare-tag ${variant.featured ? "scenario-compare-tag-featured" : ""}`}>{variant.tag}</span>
              </div>
              <div className="scenario-compare-meta">{variant.meta}</div>
            </button>
          ))}
        </div>
      ) : null}

      {screen.matrix ? (
        <div className="scenario-matrix-card">
          <div className="scenario-matrix-head">
            <span>Источник</span>
            <span>Риск</span>
            <span>Стоимость</span>
            <span>Долг</span>
          </div>
          {screen.matrix.map((row) => (
            <div className="scenario-matrix-row" key={row.name}>
              <div className="scenario-matrix-grid">
                <span className="scenario-matrix-name">{row.name}</span>
                <span className={`scenario-matrix-risk ${row.riskTone === "amber" ? "scenario-matrix-risk-amber" : ""}`}>{row.risk}</span>
                <span>{row.cost}</span>
                <span>{row.debt}</span>
              </div>
              <span className="scenario-matrix-impact">Влияние на бизнес: {row.impact}</span>
            </div>
          ))}
        </div>
      ) : null}

      {screen.ladder ? (
        <div className="scenario-ladder-card">
          <div className="scenario-ladder-kicker">Лестница эскалации</div>
          {screen.ladder.map((row) => (
            <div className="scenario-ladder-row" key={`${row.index}-${row.name}`}>
              <span className={`scenario-ladder-index ${row.accent ? "scenario-ladder-index-accent" : ""}`}>{row.index}</span>
              <span className="scenario-ladder-copy">
                <span className="scenario-ladder-name">{row.name}</span>
                <span className="scenario-ladder-meta">{row.meta}</span>
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {screen.note ? (
        <div className="scenario-note">
          <InfoIcon />
          <span>{screen.note}</span>
        </div>
      ) : null}

      <div className="push-bottom scenario-bottom-stack">
        {compareOutcome?.warning ? <div className="scenario-warning">{compareOutcome.warning}</div> : null}
        {primaryAction ? (
          <MobileButton
            disabled={("requiresChoice" in primaryAction ? primaryAction.requiresChoice === true : false) && choice === null}
            label={primaryAction.label}
            onClick={() => runAction(primaryAction.action)}
          />
        ) : null}
        {secondaryAction ? (
          <button className="scenario-secondary-link" onClick={() => runAction(secondaryAction.action)} type="button">
            {secondaryAction.label}
          </button>
        ) : null}
        {screen.foot ? <div className="scenario-foot">{screen.foot}</div> : null}
      </div>
    </div>
  );
}

function CreditHistoryUnlockScreen({ goTo }: Pick<ScreenProps, "goTo">) {
  const [progress, setProgress] = useState(0);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    let frameId = 0;
    let pulseTimer = 0;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const next = Math.min(100, Math.round((elapsed / 980) * 100));
      setProgress(next);

      if (next < 100) {
        frameId = window.requestAnimationFrame(animate);
        return;
      }

      pulseTimer = window.setTimeout(() => {
        setShowPulse(true);
      }, 120);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(pulseTimer);
    };
  }, []);

  return (
    <div className="screen-body credit-history-screen">
      <BackHeader onBack={() => goTo("safe_to_spend")} />
      <div className="credit-history-unlock">
        <span
          className={`credit-history-ring ${showPulse ? "credit-history-ring-pulse" : ""}`}
          style={{ "--credit-history-progress": progress } as CSSProperties}
        >
          <span className="credit-history-ring-inner">
            <span className="credit-history-percent">{progress}%</span>
            <span className="credit-history-ring-caption">рейтинг доверия</span>
          </span>
        </span>
        <span className="credit-history-level-badge">Новый уровень</span>
        <h1 className="screen-title compact scenario-title-centered">Надёжный партнёр</h1>
        <div className="credit-history-status-sub">Альтернативная кредитная история сформирована</div>
      </div>

      <div className="credit-history-summary-card">
        Ты прошёл путь от первого сбора до кризиса и восстановления — это и есть история, которую банки обычно требуют годами.
      </div>

      <ScenarioRowList
        className="credit-history-history-card"
        rows={ALT_CREDIT_HISTORY_HISTORY_ROWS.map((row) => ({ ...row, tick: true }))}
      />

      <div className="push-bottom">
        <MobileButton label="Смотреть продукты" onClick={() => goTo("credit_history_products")} />
      </div>
    </div>
  );
}

function CreditHistoryProductsScreen({ goTo, showToast }: Pick<ScreenProps, "goTo" | "showToast">) {
  return (
    <div className="screen-body screen-body-nav credit-history-products-screen">
      <div className="screen-scroll with-nav">
        <BackHeader onBack={() => goTo("credit_history_unlock")} />
        <h1 className="screen-title compact">Доступные продукты</h1>
        <p className="screen-copy credit-history-products-copy">
          У каждого продукта видно основание: почему он открылся именно сейчас.
        </p>

        <div className="credit-history-product-list">
          {ALT_CREDIT_HISTORY_PRODUCTS.map((product, index) => (
            <button
              key={product.name}
              className="credit-history-product-card"
              onClick={() => showToast("В P0 эта витрина заканчивается объяснением доступности продукта, без отдельного продуктового флоу.")}
              style={{ animationDelay: `${index * 80}ms` }}
              type="button"
            >
              <span className="credit-history-product-head">
                <span className="credit-history-product-icon">
                  <AlternativeCreditHistoryProductIconGlyph icon={product.icon} />
                </span>
                <span className="credit-history-product-copy">
                  <span className="credit-history-product-name">{product.name}</span>
                  <span className="credit-history-product-description">{product.description}</span>
                </span>
                <ChevronRightIcon />
              </span>
              <span className="credit-history-product-reason">
                <TickSquareIcon color="#8FEE52" />
                <span>{product.reason}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="credit-history-why-card">
          <div className="credit-history-why-kicker">Почему это возможно</div>
          <div className="credit-history-why-copy">{ALT_CREDIT_HISTORY_EXPLANATION}</div>
        </div>
      </div>

      <BottomNav activeIndex={3} goTo={goTo} showToast={showToast} />
    </div>
  );
}

function renderCalcSourceRow(row: string) {
  const match = row.match(/^([\d\s]+₽)(.*)$/);

  if (!match) {
    return <span className="calc-row-copy">{row}</span>;
  }

  const [, amount, rest] = match;

  return (
    <span className="calc-row-copy">
      <strong>{amount}</strong>
      <span>{rest}</span>
    </span>
  );
}

function HowCalculatedChart() {
  const [lineDrawn, setLineDrawn] = useState(false);
  const [guidesVisible, setGuidesVisible] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setLineDrawn(true);
    });
    const guidesTimer = window.setTimeout(() => {
      setGuidesVisible(true);
    }, 1120);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(guidesTimer);
    };
  }, []);

  const width = 320;
  const height = 188;
  const margin = { top: 14, right: 12, bottom: 34, left: 48 };
  const minAmount = 50_000;
  const maxAmount = 450_000;
  const yTicks = [450_000, 350_000, 250_000, 150_000, 50_000];
  const values = [402_000, 386_000, 352_000, 394_000, 212_000, 246_000, 318_000, 168_000, 276_000, 354_000, 392_000];
  const highlightedIndexes = new Set([4, 7]);
  const baselineY = height - margin.bottom;
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const amountRange = maxAmount - minAmount;
  const pointX = (index: number) => margin.left + (chartWidth / (values.length - 1)) * index;
  const pointY = (value: number) => margin.top + ((maxAmount - value) / amountRange) * chartHeight;
  const points = values.map((value, index) => ({ x: pointX(index), y: pointY(value), value, highlighted: highlightedIndexes.has(index) }));
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const weekFormatter = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" });
  const weekLabels = Array.from({ length: 5 }, (_, index) => {
    const date = new Date(2026, 7, 12 + index * 7);
    return {
      x: margin.left + (chartWidth / 4) * index,
      label: weekFormatter.format(date).replace(".", ""),
    };
  });

  return (
    <svg className="chart-svg how-calculated-chart-svg" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      {yTicks.map((tick, index) => {
        const y = pointY(tick);
        return (
          <g key={tick}>
            <line
              x1={margin.left}
              x2={width - margin.right}
              y1={y}
              y2={y}
              className={`how-calculated-grid-line ${index === yTicks.length - 1 ? "how-calculated-grid-line-base" : ""}`}
            />
            <text x={10} y={y + 4} className="how-calculated-axis-label how-calculated-axis-label-left">
              {tick.toLocaleString("ru-RU")} ₽
            </text>
          </g>
        );
      })}

      {weekLabels.map((tick) => (
        <g key={tick.label}>
          <line x1={tick.x} x2={tick.x} y1={baselineY} y2={baselineY + 6} className="how-calculated-bottom-tick" />
          <text x={tick.x} y={height - 8} textAnchor={tick.x === margin.left ? "start" : tick.x === width - margin.right ? "end" : "middle"} className="how-calculated-axis-label">
            {tick.label}
          </text>
        </g>
      ))}

      <path
        d={path}
        pathLength={1}
        className={`how-calculated-line ${lineDrawn ? "how-calculated-line-drawn" : ""}`}
      />

      {points.filter((point) => point.highlighted).map((point) => (
        <g key={`${point.x}-${point.y}`} className={`how-calculated-point-group ${guidesVisible ? "how-calculated-point-group-visible" : ""}`}>
          <line x1={margin.left} x2={point.x} y1={point.y} y2={point.y} className="how-calculated-guide-line" />
          <line x1={point.x} x2={point.x} y1={point.y} y2={baselineY} className="how-calculated-guide-line" />
          <circle cx={point.x} cy={point.y} r={5.5} className="how-calculated-point" />
        </g>
      ))}
    </svg>
  );
}

function formatAuditAppearance(at: string, index: number) {
  const date = new Date(at);
  date.setUTCMinutes(date.getUTCMinutes() - index * 3);
  return formatCompactRuDateTime(date.toISOString());
}

function ProcessingScreen({ state, dispatchRouteAction }: Pick<ScreenProps, "state" | "dispatchRouteAction">) {
  const [showPulse, setShowPulse] = useState(false);
  const finishProcessing = useEffectEvent(() => {
    dispatchRouteAction({ type: "advance_processing" });
  });
  const isCompleting = state.processingIndex === PROCESSING_TASKS.length - 1;
  const isCompleteAndWaiting = state.processingIndex >= PROCESSING_TASKS.length;

  useEffect(() => {
    if (!isCompleting) return undefined;

    const pulseTimer = window.setTimeout(() => {
      setShowPulse(true);
    }, 280);

    const completeTimer = window.setTimeout(() => {
      finishProcessing();
    }, 3320);

    return () => {
      window.clearTimeout(pulseTimer);
      window.clearTimeout(completeTimer);
    };
  }, [isCompleting, state.processingIndex]);

  useEffect(() => {
    if (!isCompleteAndWaiting) return undefined;

    const fallbackTimer = window.setTimeout(() => {
      finishProcessing();
    }, 5000);

    return () => {
      window.clearTimeout(fallbackTimer);
    };
  }, [isCompleteAndWaiting, state.processingIndex]);

  const importedTasks = PROCESSING_TASKS.slice(0, 2);
  const userTasks = PROCESSING_TASKS.slice(2);
  const completionStage = !isCompleting ? "idle" : showPulse ? "pulse" : "fill";
  const visibleProcessingIndex = isCompleting ? PROCESSING_TASKS.length : state.processingIndex;
  const completedImported = Math.min(visibleProcessingIndex, importedTasks.length);
  const completedUser = Math.max(0, visibleProcessingIndex - importedTasks.length);
  const progress = Math.min(visibleProcessingIndex / PROCESSING_TASKS.length, 1);

  return (
    <div className="processing-screen">
      <div
        className={`processing-ring ${progress >= 1 ? "processing-ring-complete" : ""} ${completionStage === "fill" ? "processing-ring-finishing" : ""} ${completionStage === "pulse" ? "processing-ring-pulse" : ""}`}
        style={{ "--processing-progress": progress } as CSSProperties}
      >
        <div className="processing-ring-border" />
        <div className={`processing-ring-core ${progress >= 1 ? "processing-ring-core-complete" : ""}`}>
          <span className={`processing-ring-glyph ${progress >= 1 ? "processing-ring-glyph-complete" : ""}`}>
            <MetronomeGlyph
              armColor={progress >= 1 ? "#1D1D1B" : "#EF3124"}
              color={progress >= 1 ? "#8FEE52" : "#1D1D1B"}
            />
          </span>
        </div>
      </div>
      <div className="centered">
        <h1 className="screen-title compact">AI-агент собирает сводку</h1>
        <p className="screen-copy narrow centered">Проверяю документы и привожу их к единой модели обязательств.</p>
      </div>

      <div className="stack gap-sm wide">
        <div className="processing-group">
          <div className="processing-group-title">Уже подтянул из «Народных инвестиций»</div>
          {importedTasks.map((task, index) => {
            const done = index < completedImported;
            return (
              <div className={`processing-row ${done ? "processing-row-done" : "processing-row-pending"}`} key={task.id}>
                <ProcessingStatusIcon done={done} />
                <span className="processing-row-label">{task.label}</span>
                <small>{done ? task.hint : "в работе"}</small>
              </div>
            );
          })}
        </div>

        <div className="processing-group">
          <div className="processing-group-title">Отдельно сверяю по данным бизнеса</div>
          {userTasks.map((task, index) => {
            const done = index < completedUser;
            return (
              <div className={`processing-row ${done ? "processing-row-done" : "processing-row-pending"}`} key={task.id}>
                <ProcessingStatusIcon done={done} />
                <span className="processing-row-label">{task.label}</span>
                <small>{done ? task.hint : "в работе"}</small>
              </div>
            );
          })}
        </div>
      </div>
      <div className="processing-footer">Распознаю, но не додумываю</div>
    </div>
  );
}

function FoundScreen({ viewModel, goTo, goBack }: Pick<ScreenProps, "viewModel" | "goTo" | "goBack">) {
  const [showResolvedRows, setShowResolvedRows] = useState(false);
  const [visibleRows, setVisibleRows] = useState(0);

  useEffect(() => {
    const revealTimer = window.setTimeout(() => {
      setShowResolvedRows(true);
    }, 1080);

    return () => {
      window.clearTimeout(revealTimer);
    };
  }, [viewModel.foundRows]);

  useEffect(() => {
    if (!showResolvedRows) return undefined;
    if (visibleRows >= viewModel.foundRows.length) return undefined;

    const rowTimer = window.setTimeout(() => {
      setVisibleRows((current) => Math.min(current + 1, viewModel.foundRows.length));
    }, 150);

    return () => {
      window.clearTimeout(rowTimer);
    };
  }, [showResolvedRows, viewModel.foundRows.length, visibleRows]);

  return (
    <div className="screen-body">
      <BackHeader onBack={goBack} />
      <span className="status-chip yellow found-status-chip align-start">Нужно уточнение</span>
      <h1 className="screen-title">Нашёл 7 обязательств и 3 регулярных платежа</h1>
      <p className="screen-copy">Один документ читается двояко: нужно уточнить дату до финального расчёта.</p>
      <div className="found-obligation-list">
        {!showResolvedRows
          ? viewModel.foundRows.map((row) => (
              <div className="found-obligation-card found-obligation-card-loading" key={row.label}>
                <div className="found-loading-copy">
                  <span className="found-loading-label">Подтягиваю обязательство</span>
                  <FoundLoadingDots />
                </div>
              </div>
            ))
          : viewModel.foundRows.slice(0, visibleRows).map((row) => {
              const ambiguous = /уточнить/i.test(row.meta);
              return (
                <div className="found-obligation-card" key={row.label}>
                  <span className="found-obligation-label">{row.label}</span>
                  <span className={`found-obligation-meta ${ambiguous ? "found-obligation-meta-ambiguous" : ""}`}>{row.meta}</span>
                </div>
              );
            })}
      </div>
      <div className="push-bottom">
        <div data-testid="go-clarification">
          <MobileButton label="Уточнить →" onClick={() => goTo("clarification")} />
        </div>
      </div>
    </div>
  );
}

function ClarificationScreen({ state, goTo, dispatchRouteAction }: Pick<ScreenProps, "state" | "goTo" | "dispatchRouteAction">) {
  const [resolvedChoice, setResolvedChoice] = useState(state.clarificationChoice);
  const [isThinking, setIsThinking] = useState(false);
  const thinkingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (thinkingTimerRef.current !== null) {
        window.clearTimeout(thinkingTimerRef.current);
      }
    };
  }, []);

  const handleClarificationPick = (option: string) => {
    state.dispatch({ type: "pick_clarification_date", isoDate: option });

    if (thinkingTimerRef.current !== null) {
      window.clearTimeout(thinkingTimerRef.current);
    }

    setIsThinking(true);
    thinkingTimerRef.current = window.setTimeout(() => {
      setResolvedChoice(option);
      setIsThinking(false);
      thinkingTimerRef.current = null;
    }, 920);
  };

  return (
    <div className="screen-body">
      <BackHeader onBack={() => goTo("found")} />
      <h1 className="screen-title compact">Нужно уточнение</h1>
      <div className="clarify-card">
        <div className="clarify-doc-row">
          <DocumentIcon />
          <span>Договор поставщика №14-К</span>
        </div>
        <p className="clarify-question">
          В договоре две даты оплаты первого платежа: 14 и 18 августа 2026 года. Какая действует?
        </p>
        <div className="clarify-options">
          {CLARIFY_OPTIONS.map((option) => {
            const selected = state.clarificationChoice === option;
            return (
              <button
                key={option}
                className={`clarify-option ${selected ? "clarify-option-active" : ""}`}
                data-testid={`clarify-${option}`}
                onClick={() => handleClarificationPick(option)}
                type="button"
              >
                {formatRuDate(option)}
              </button>
            );
          })}
        </div>
      </div>
      {state.clarificationChoice && isThinking ? <ClarificationThinkingCard /> : null}
      {state.clarificationChoice && !isThinking && resolvedChoice ? (
        <div className="info-card">
          <TickSquareIcon />
          <span>
            <strong>Принято: {formatRuDate(resolvedChoice)}</strong>
            <small>Теперь план можно пересчитать без догадок.</small>
          </span>
        </div>
      ) : null}
      <div className="screen-footer-note">
        <InfoIcon />
        <span>В деньгах нельзя додумывать: выбор влияет на финансовый план, поэтому его делает человек.</span>
      </div>
      <div className="push-bottom">
        <div data-testid="recalculate-summary">
          <MobileButton
            disabled={state.clarificationChoice === null}
            label="Пересчитать сводку →"
            onClick={() => dispatchRouteAction({ type: "apply_clarification" })}
          />
        </div>
      </div>
    </div>
  );
}

function SafeToSpendScreen({
  state,
  viewModel,
  goTo,
  showToast,
  dispatchRouteAction,
}: Pick<ScreenProps, "state" | "viewModel" | "goTo" | "showToast" | "dispatchRouteAction">) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const stackRef = useRef<HTMLDivElement | null>(null);
  const [stackProgress, setStackProgress] = useState(0);
  const profile = viewModel.profile;
  const segmentRows = state.envelopes
    .filter((envelope) => ["env_rent_payroll", "env_backers", "env_tax", "env_supplier"].includes(envelope.id))
    .map((envelope) => ({
      label: envelope.title,
      amount: envelope.protectedAmount,
      color:
        envelope.id === "env_rent_payroll"
          ? "#cfdabb"
          : envelope.id === "env_backers"
            ? "#ead7b5"
            : envelope.id === "env_tax"
              ? "#e5c9b8"
              : "#dddfe6",
    }))
    .concat([{ label: "Свободно", amount: state.safeToSpend, color: "#1d1d1b" }]);
  const total = segmentRows.reduce((sum, item) => sum + item.amount, 0);
  const hubStatus =
    state.businessStatus === "risk"
      ? { label: "Есть риск", dotClass: "amber" }
      : state.businessStatus === "needs_clarification"
        ? { label: "Нужно уточнение", dotClass: "red" }
        : { label: "Всё под контролем", dotClass: "green" };
  const liveEnvelopeCards = state.envelopes.slice(0, 5).map((envelope) => {
    const tone =
      envelope.id === "env_rent_payroll"
        ? { bg: "#dce7a8", accent: "#c4d87e", rail: "#f7f9ef" }
        : envelope.id === "env_backers"
          ? { bg: "#f3d48f", accent: "#ebc15d", rail: "#fff8eb" }
          : envelope.id === "env_tax"
            ? { bg: "#efc79a", accent: "#e2af73", rail: "#fff4ea" }
            : envelope.id === "env_supplier"
              ? { bg: "#ebb3a6", accent: "#df8f82", rail: "#fff0ec" }
              : { bg: "#2f2b28", accent: "#44403c", rail: "#f4f1ed" };

    return {
      ...envelope,
      tone,
      dueText:
        envelope.dueLabel.startsWith("до") || envelope.dueLabel === "формируется"
          ? envelope.dueLabel
          : `до ${envelope.dueLabel}`,
    };
  });
  const envelopeCount = liveEnvelopeCards.length;
  const stackedStep = 34;
  const expandedStep = 178;
  const stackedHeight = 178 + (envelopeCount - 1) * stackedStep;
  const expandedHeight = 162 + (envelopeCount - 1) * expandedStep;
  const stackHeight = stackedHeight + (expandedHeight - stackedHeight) * stackProgress;

  useEffect(() => {
    const scrollNode = scrollRef.current;
    const stackNode = stackRef.current;
    if (!scrollNode || !stackNode) return undefined;

    let frameId = 0;

    const updateProgress = () => {
      frameId = 0;
      const start = Math.max(0, stackNode.offsetTop - scrollNode.clientHeight + 250);
      const distance = Math.max(280, expandedHeight - stackedHeight - 20);
      const nextProgress = Math.min(1, Math.max(0, (scrollNode.scrollTop - start) / distance));
      setStackProgress((current) => (Math.abs(current - nextProgress) < 0.005 ? current : nextProgress));
    };

    const requestUpdate = () => {
      if (frameId !== 0) return;
      frameId = window.requestAnimationFrame(updateProgress);
    };

    requestUpdate();
    scrollNode.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      scrollNode.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [expandedHeight, stackedHeight]);

  return (
    <div className="screen-body screen-body-nav">
      <div className="screen-scroll with-nav safe-screen-scroll" ref={scrollRef}>
        <div className={`status-row status-row-${hubStatus.dotClass}`}>
          <span className={`status-dot ${hubStatus.dotClass}`} />
          <strong>{hubStatus.label}</strong>
          <MetronomeGlyph color="#1D1D1B" />
        </div>

        <button className="credit-history-entry-card" onClick={() => goTo(ALT_CREDIT_HISTORY_ENTRY.step)} type="button">
          <span className="credit-history-entry-orb" aria-hidden="true" />
          <span className="credit-history-entry-kicker-row">
            <span className="credit-history-entry-dot" />
            <span className="credit-history-entry-kicker">{ALT_CREDIT_HISTORY_ENTRY.kicker}</span>
          </span>
          <span className="credit-history-entry-title">{ALT_CREDIT_HISTORY_ENTRY.title}</span>
          <span className="credit-history-entry-sub">{ALT_CREDIT_HISTORY_ENTRY.sub}</span>
          <span className="credit-history-entry-button">{ALT_CREDIT_HISTORY_ENTRY.button}</span>
        </button>

        <section className="hero-card free-hero-card">
          <div className="free-label">Действительно свободно</div>
          <div className="free-amount">{formatMoney(state.safeToSpend)}</div>
          <button className="inline-link safe-calculation-link" data-testid="how-calculated-link" onClick={() => goTo("how_calculated")} type="button">
            Как я это посчитал <ChevronRightIcon />
          </button>
        </section>

        <section className="hero-card accounts-hero-card">
          <div className="row-between compact">
            <span className="muted">На всех счетах</span>
            <strong>{formatMoney(state.currentAccountsTotal)}</strong>
          </div>
          <div className="segment-track">
            {segmentRows.map((segment) => (
              <span
                key={segment.label}
                className="segment-fill"
                style={{ width: `${(segment.amount / total) * 100}%`, background: segment.color }}
              />
            ))}
          </div>
          <div className="segment-legend">
            {segmentRows.map((segment) => (
              <span key={segment.label} className="segment-legend-item">
                <span className="segment-dot" style={{ background: segment.color }} />
                {segment.label}
              </span>
            ))}
          </div>
          <div className="hero-math-row">
            <span>На всех счетах</span>
            <strong>{formatMoney(state.currentAccountsTotal)}</strong>
          </div>
          <div className="hero-math-row grouped">
            <span>− Связано обязательствами</span>
            <strong>{formatMoney(state.committedTotal)}</strong>
            <small>из них кампания «Народные инвестиции» — {formatMoney(state.campaignCommittedSlice)}</small>
          </div>
        </section>

        <section className="micro-card safe-updates-card">
          <div className="row-between">
            <span className="muted">Что изменилось</span>
            <span className="status-chip gray">{profile.kpi.label}: {profile.kpi.value}</span>
          </div>
          <strong className="safe-updates-title">{viewModel.activityLine}</strong>
          <p className="card-copy">{profile.operationalSignalLabel} · {viewModel.formattedLastUpdated}</p>
        </section>

        <section className="micro-card safe-audit-card">
          <div className="row-between safe-audit-head">
            <span className="muted">Что сделал Метроном</span>
            <button className="link-button inline safe-audit-next-check" onClick={() => showToast("Следующая проверка: сегодня в 14:00 и после каждого нового события.")} type="button">
              Следующая проверка
            </button>
          </div>
          <div className="audit-list">
            {state.auditTrail.slice(0, 3).map((entry, index) => (
              <div className="audit-row" key={entry.id}>
                <span className="audit-row-bullet" aria-hidden="true" />
                <div className="audit-row-copy">
                  <strong>{entry.title}</strong>
                  <span>{entry.details}</span>
                  <small>{formatAuditAppearance(entry.at, index)}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="daily-cycle-section">
          <div className="daily-cycle-head">
            <span className="daily-cycle-title">Ежедневный цикл</span>
            <span className="daily-cycle-subtitle">Сценарии дня</span>
          </div>
          <div className="daily-cycle-carousel-shell">
            <ScenarioEntryCarousel entries={DAILY_CYCLE_ENTRY_CARDS} goTo={goTo} />
          </div>
        </section>

        <div className="section-label envelope-section-label">Живые конверты</div>
        <div
          className="envelope-stack"
          data-testid="live-envelopes-stack"
          ref={stackRef}
          style={{ height: `${stackHeight}px` }}
        >
          {liveEnvelopeCards.map((envelope, index) => (
            <div
              key={envelope.id}
              className="envelope-stack-layer"
              style={
                {
                  "--stack-index": index,
                  "--stack-progress": stackProgress,
                  "--stack-y": `${index * (stackedStep + (expandedStep - stackedStep) * stackProgress)}px`,
                } as CSSProperties
              }
            >
            <button
              className={`envelope-card ${envelope.id === "env_reserve" ? "envelope-card-dark" : ""}`}
              onClick={() => {
                if (envelope.id === "env_reserve") {
                  goTo("reserve_rule");
                  return;
                }
                dispatchRouteAction({ type: "open_envelope", envelopeId: envelope.id });
              }}
              style={
                {
                  "--envelope-bg": envelope.tone.bg,
                  "--envelope-accent": envelope.tone.accent,
                  "--envelope-rail": envelope.tone.rail,
                } as CSSProperties
              }
              type="button"
            >
              <span className="envelope-card-inner-outline" aria-hidden="true" />
              <span className="envelope-card-fold" aria-hidden="true" />
              <span className="envelope-card-top">
                <span className="envelope-card-copy">
                  <strong>{envelope.title}</strong>
                  <small>{envelope.dueText}</small>
                </span>
                <span className="envelope-card-seal">
                  <span className="envelope-card-seal-dot" />
                </span>
              </span>
              <span className="envelope-card-bottom">
                <span className="envelope-card-meta-row">
                  <span className="envelope-card-mini">{envelope.dueText}</span>
                  <span className="envelope-card-mini">{formatMoney(envelope.protectedAmount)}</span>
                </span>
                <span className="envelope-card-rail">
                  <span className="envelope-card-status">{envelope.statusLabel}</span>
                  <strong>{formatMoney(envelope.protectedAmount)}</strong>
                </span>
              </span>
            </button>
          </div>
          ))}
        </div>
      </div>
      <BottomNav activeIndex={0} goTo={goTo} showToast={showToast} />
    </div>
  );
}

function HowCalculatedScreen({ state, viewModel, goTo }: Pick<ScreenProps, "state" | "viewModel" | "goTo">) {
  const firstDeficitLabel = viewModel.plan.firstDeficitDate ? formatRuDate(viewModel.plan.firstDeficitDate) : "дефицита нет";
  const profile = viewModel.profile;

  return (
    <div className="screen-body screen-body-scroll">
      <div className="screen-title-row">
        <button aria-label="Назад" className="icon-button" onClick={() => goTo("safe_to_spend")} type="button">
          <BackIcon />
        </button>
        <h1 className="screen-title compact">Как я это посчитал</h1>
      </div>
      <p className="screen-copy">30-дневный прогноз: факт — {profile.fact}, прогноз — {profile.forecast}.</p>

      <div className="chart-card how-calculated-chart-card">
        <HowCalculatedChart />
      </div>

      <div className="micro-card how-calculated-summary-card">
        <strong>Без защиты обязательств здесь возник бы дефицит.</strong>
        <p className="card-copy how-calculated-summary-copy">
          Минимальный прогнозный остаток:
          {" "}
          <span className="how-calculated-answer">{formatMoney(viewModel.plan.minimumBalance)}.</span>
        </p>
        <p className="card-copy how-calculated-summary-copy">
          Первая дата дефицита без защиты:
          {" "}
          <span className="how-calculated-answer">{firstDeficitLabel}</span>
          .
        </p>
      </div>

      <div className="section-label how-calculated-section-label">Источники цифр</div>
      <div className="fact-list-card how-calculated-sources-card">
        {viewModel.calcSources.map((row) => (
          <div className="calc-row" key={row}>
            {renderCalcSourceRow(row)}
          </div>
        ))}
      </div>

      <div className="micro-card">
        <div className="row-between">
          <span className="muted">Объяснение</span>
          <span className="status-chip gray">{state.llmExplanationSource === "live" ? "GigaChat" : "Fallback"}</span>
        </div>
        <p className="card-copy">
          {state.llmExplanation ?? FALLBACK_EXPLANATIONS[state.industryProfileId]}
        </p>
      </div>

      <div data-testid="how-calculated-done">
        <MobileButton label="Понятно" onClick={() => goTo("envelopes")} />
      </div>
    </div>
  );
}

function EnvelopesScreen({ state, goTo, showToast, dispatchRouteAction }: Pick<ScreenProps, "state" | "goTo" | "showToast" | "dispatchRouteAction">) {
  const visibleEnvelopes = state.envelopes.map((envelope) => ({
    ...envelope,
    amount:
      envelope.id === "env_reserve"
        ? `${formatMoney(state.reserveRule.currentAmount)} из ${formatMoney(state.reserveRule.targetAmount)}`
        : formatMoney(envelope.protectedAmount),
  }));

  return (
    <div className="screen-body">
      <BackHeader onBack={() => goTo("safe_to_spend")} />
      <h1 className="screen-title compact">Защитим деньги для важных платежей</h1>
      <p className="screen-copy">Конверты логически распределяют деньги, чтобы обязательства оставались обеспечены.</p>

      <div className="fact-list-card">
        {visibleEnvelopes.map((envelope) => (
          <button
            key={envelope.id}
            className="envelope-table-row"
            onClick={() => {
              if (envelope.id === "env_reserve") {
                goTo("reserve_rule");
                return;
              }
              if (envelope.id === "env_free") {
                showToast("Свободные деньги уже рассчитаны и не требуют отдельной настройки.");
                return;
              }
              dispatchRouteAction({ type: "open_envelope", envelopeId: envelope.id });
            }}
            type="button"
          >
            <span className="envelope-table-copy">
              <strong>{envelope.title}</strong>
              <small>{envelope.amount}</small>
            </span>
            <span className="muted">{envelope.dueLabel}</span>
          </button>
        ))}
      </div>

      <div className="metronome-card light">
        <span className="eyebrow red">Как это работает</span>
        <p className="metronome-card-copy dark">
          Конверты не создают отдельные счета сами по себе: деньги остаются на ваших счетах, но не попадают в свободный остаток.
        </p>
      </div>

      <div className="push-bottom" data-testid="go-reserve-rule">
        <MobileButton label="Настроить страховой запас →" onClick={() => goTo("reserve_rule")} />
      </div>
    </div>
  );
}

function EnvelopeDetailScreen({
  state,
  viewModel,
  goBack,
}: Pick<ScreenProps, "state" | "viewModel" | "goBack">) {
  const detail = viewModel.envelopeDetail;
  const currentEnvelopeId = state.selectedEnvelopeId === "env_backers" ? "env_backers" : "env_rent_payroll";

  return (
    <div className="screen-body">
      <BackHeader onBack={goBack} />

      <div className="stack gap-sm">
        <div className={`detail-hero detail-hero-envelope ${currentEnvelopeId === "env_backers" ? "detail-hero-envelope-backers" : ""}`}>
          <span className="muted detail-hero-label">{detail.title}</span>
          <div className="detail-total">{detail.total}</div>
          <span className="status-chip green detail-hero-chip">{detail.status}</span>
        </div>
        <div className="fact-list-card">
          {detail.rows.map((row) => (
            <div className="found-row" key={row.label}>
              <strong>{row.label}</strong>
              <span>
                {row.amount}
                <small>{row.due}</small>
              </span>
            </div>
          ))}
        </div>
        <div className="micro-card">
          <span className="eyebrow muted">Откуда данные</span>
          <p className="card-copy dark">{detail.sourceCopy}</p>
        </div>
        <div className="micro-card">
          <span className="eyebrow muted">Учтённые поступления</span>
          <p className="card-copy dark">{detail.incomeCopy}</p>
        </div>
      </div>

      <div className="push-bottom center-note">{detail.note}</div>
    </div>
  );
}

function ReserveRuleScreen({ state, goTo, dispatchRouteAction }: Pick<ScreenProps, "state" | "goTo" | "dispatchRouteAction">) {
  return (
    <div className="screen-body">
      <BackHeader onBack={() => goTo("envelopes")} />
      <h1 className="screen-title compact">Страховой запас</h1>

      <div className="fact-card">
        <div className="reserve-amount-row">
          <strong className="reserve-current">{state.reserveRule.currentAmount.toLocaleString("ru-RU")}</strong>
          <span className="muted">из {formatMoney(state.reserveRule.targetAmount)}</span>
        </div>
        <div className="progress-track tall">
          <span className="progress-fill dark" style={{ width: "30%" }} />
        </div>
        <p className="card-copy">Текущего объёма хватает примерно на 4 дня обязательных расходов.</p>
      </div>

      <div className="metronome-card reserve-rule-card">
        <span className="eyebrow red">Правило</span>
        <strong className="metronome-card-title">Направлять 7% действительно свободных поступлений в резерв</strong>
        <p className="metronome-card-copy">
          При текущем прогнозе цель будет достигнута 4 сентября 2026 года. Если поступления снизятся, правило приостановится.
        </p>
      </div>

      <div className="fact-list-card">
        <div className="eyebrow muted">Ограничения</div>
        {[
          "не более 5 000 ₽ в день",
          "не трогать обязательные конверты",
          "не опускать Safe-to-Spend ниже 60 000 ₽",
          "при ухудшении прогноза сначала защищать аренду, зарплаты, налоги и бэкеров",
        ].map((item) => (
          <div className="limit-row" key={item}>
            <span className="limit-dot" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      <div className="push-bottom" data-testid="prepare-reserve-rule">
        <MobileButton label="Подтвердить правило" onClick={() => dispatchRouteAction({ type: "prepare_reserve_rule" })} />
      </div>
    </div>
  );
}

function ReserveFormatScreen({
  state,
  setReserveMode,
  goBack,
  dispatchRouteAction,
}: Pick<ScreenProps, "state" | "setReserveMode" | "goBack" | "dispatchRouteAction">) {
  const selectedMode = state.reserveRule.mode ?? "logical";

  return (
    <div className="screen-body">
      <BackHeader onBack={goBack} />
      <h1 className="screen-title compact">Как хранить резерв</h1>
      <p className="screen-copy">Оба варианта учитываются в расчёте одинаково, но только один не двигает реальные деньги.</p>

      <div className="stack gap-sm">
        <button
          className={`choice-card choice-card-column ${selectedMode === "logical" ? "choice-card-active" : ""}`}
          data-testid="reserve-mode-logical"
          onClick={() => setReserveMode("logical")}
          type="button"
        >
          <span className="radio-row">
            <span className={`radio-dot ${selectedMode === "logical" ? "radio-dot-active" : ""}`} />
            <strong>Только логически</strong>
          </span>
          <span className="muted left-pad">Учитываю в расчётах, деньги остаются на основном счёте.</span>
        </button>
        <button
          className={`choice-card choice-card-column ${selectedMode === "separate_account" ? "choice-card-active" : ""}`}
          data-testid="reserve-mode-separate"
          onClick={() => setReserveMode("separate_account")}
          type="button"
        >
          <span className="radio-row">
            <span className={`radio-dot ${selectedMode === "separate_account" ? "radio-dot-active" : ""}`} />
            <strong>Хранить отдельно</strong>
          </span>
          <span className="muted left-pad">Подготовлю перевод 18 000 ₽ на накопительный счёт Альфы.</span>
        </button>
      </div>

      <div className="screen-footer-note">
        <InfoIcon />
        <span>Даже во втором варианте ничего не переведу без отдельного подтверждения.</span>
      </div>

      <div className="push-bottom" data-testid="save-reserve-format">
        <MobileButton
          label={selectedMode === "separate_account" ? "Подготовить перевод →" : "Сохранить формат"}
          onClick={() => dispatchRouteAction({ type: "save_reserve_format" })}
        />
      </div>
    </div>
  );
}

function TransferConfirmScreen({ state, dispatchRouteAction, goBack }: Pick<ScreenProps, "state" | "dispatchRouteAction" | "goBack">) {
  return (
    <div className="screen-body">
      <BackHeader onBack={goBack} />
      <h1 className="screen-title compact">Подтверждение перевода</h1>

      <div className="metronome-card transfer-card">
        <span className="eyebrow faded">Сумма перевода</span>
        <div className="transfer-amount">{formatMoney(18_000)}</div>
        <div className="transfer-row">
          <span>
            <small>Откуда</small>
            <strong>Основной счёт</strong>
          </span>
          <span className="transfer-arrow">→</span>
          <span className="right-align">
            <small>Куда</small>
            <strong>Накопительный Альфы</strong>
          </span>
        </div>
      </div>

      <div className="fact-card">
        <div className="row-between">
          <span className="muted">Свободные после перевода</span>
          <strong>{formatMoney(Math.max(0, state.safeToSpend - 18_000))}</strong>
        </div>
        <div className="row-between">
          <span className="muted">Обязательства затронуты</span>
          <strong>Нет</strong>
        </div>
      </div>

      <div className="push-bottom stack gap-sm">
        <div data-testid="confirm-transfer">
          <MobileButton label="Подтвердить перевод" onClick={() => dispatchRouteAction({ type: "confirm_transfer" })} />
        </div>
        <div className="center-note">Разовое разрешение. До подтверждения операция не выполняется.</div>
      </div>
    </div>
  );
}

function RuleActiveScreen({ state, goTo }: Pick<ScreenProps, "state" | "goTo">) {
  const isLogical = state.reserveRule.mode === "logical";
  return (
    <div className="screen-body">
      <div className="success-hero">
        <span className="success-badge">
          <svg width="38" height="30" viewBox="0 0 38 30">
            <path d="M3 15.5 13.5 26 35 4" stroke="#1D1D1B" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h1 className="screen-title compact">Правило активно</h1>
      </div>

      <div className="fact-list-card">
        {[
          isLogical
            ? "Резерв учитывается только логически, без реального перевода."
            : "Резерв переведён после отдельного подтверждения пользователя.",
          "Пополнение идёт только из новых действительно свободных поступлений.",
          "При ухудшении прогноза правило автоматически приостанавливается.",
        ].map((row) => (
          <div className="fact-list-row start" key={row}>
            <TickSquareIcon />
            <span>{row}</span>
          </div>
        ))}
        <div className="row-between strong-top">
          <span className="muted">Действительно свободно</span>
          <strong>{formatMoney(state.safeToSpend)}</strong>
        </div>
      </div>

      <div className="push-bottom stack gap-sm">
        <div data-testid="rule-active-home">
          <MobileButton label="На главный" onClick={() => goTo("safe_to_spend")} />
        </div>
        <div className="center-note">Метроном будет пересчитывать план после каждого нового события.</div>
      </div>
    </div>
  );
}

function ScreenRenderer(props: ScreenProps) {
  if (isAlternativeCreditHistoryStep(props.state.currentStep)) {
    if (props.state.currentStep === "credit_history_unlock") {
      return <CreditHistoryUnlockScreen goTo={props.goTo} />;
    }

    return <CreditHistoryProductsScreen goTo={props.goTo} showToast={props.showToast} />;
  }

  if (props.state.currentStep in DAILY_CYCLE_SCENARIOS) {
    return (
      <DailyCycleScenarioScreen
        key={props.state.currentStep}
        goBack={props.goBack}
        goTo={props.goTo}
        showToast={props.showToast}
        step={props.state.currentStep as DailyCycleScenarioStep}
      />
    );
  }

  switch (props.state.currentStep) {
    case "profile_picker":
      return <ProfilePickerScreen state={props.state} pickProfile={props.pickProfile} />;
    case "login":
      return <LoginScreen key={props.state.industryProfileId} dispatchRouteAction={props.dispatchRouteAction} goTo={props.goTo} state={props.state} />;
    case "home_entry":
      return <HomeEntryScreen state={props.state} viewModel={props.viewModel} goTo={props.goTo} showToast={props.showToast} />;
    case "intro":
      return <IntroScreen goTo={props.goTo} viewModel={props.viewModel} />;
    case "sources":
      return <SourcesScreen viewModel={props.viewModel} connectSource={props.connectSource} goTo={props.goTo} />;
    case "processing":
      return <ProcessingScreen dispatchRouteAction={props.dispatchRouteAction} state={props.state} />;
    case "found":
      return <FoundScreen goBack={props.goBack} goTo={props.goTo} viewModel={props.viewModel} />;
    case "clarification":
      return <ClarificationScreen dispatchRouteAction={props.dispatchRouteAction} state={props.state} goTo={props.goTo} />;
    case "safe_to_spend":
      return <SafeToSpendScreen dispatchRouteAction={props.dispatchRouteAction} state={props.state} viewModel={props.viewModel} goTo={props.goTo} showToast={props.showToast} />;
    case "how_calculated":
      return <HowCalculatedScreen state={props.state} viewModel={props.viewModel} goTo={props.goTo} />;
    case "envelopes":
      return <EnvelopesScreen dispatchRouteAction={props.dispatchRouteAction} state={props.state} goTo={props.goTo} showToast={props.showToast} />;
    case "envelope_detail":
      return <EnvelopeDetailScreen state={props.state} viewModel={props.viewModel} goBack={props.goBack} />;
    case "reserve_rule":
      return <ReserveRuleScreen dispatchRouteAction={props.dispatchRouteAction} state={props.state} goTo={props.goTo} />;
    case "reserve_format":
      return <ReserveFormatScreen dispatchRouteAction={props.dispatchRouteAction} state={props.state} setReserveMode={props.setReserveMode} goBack={props.goBack} />;
    case "transfer_confirm":
      return <TransferConfirmScreen dispatchRouteAction={props.dispatchRouteAction} goBack={props.goBack} state={props.state} />;
    case "rule_active":
      return <RuleActiveScreen state={props.state} goTo={props.goTo} />;
    default:
      return null;
  }
}

export function PrototypeApp() {
  const state = useDemoStore();
  const router = useRouter();
  const pathname = usePathname();
  const routeStep = useMemo(() => getStepForPath(pathname), [pathname]);
  const pendingStateNavigationRef = useRef(false);
  const currentStep = state.currentStep;
  const dispatch = state.dispatch;
  const viewModel = useMemo(() => buildIndustryViewModel(state), [state]);

  useEffect(() => {
    if (pendingStateNavigationRef.current) return;
    if (currentStep !== routeStep) {
      dispatch({ type: "go_to_step", step: routeStep, pushHistory: false });
    }
  }, [currentStep, dispatch, routeStep]);

  useEffect(() => {
    if (!pendingStateNavigationRef.current) return;

    const targetPath = getPathForStep(currentStep);
    if (pathname !== targetPath) {
      router.push(targetPath, { scroll: false });
    }

    pendingStateNavigationRef.current = false;
  });

  const dispatchRouteAction = (action: DemoAction) => {
    pendingStateNavigationRef.current = true;
    dispatch(action);
  };

  useAutoProcessing(currentStep, state.processingIndex, dispatchRouteAction);
  useLiveExplanation(currentStep, state, dispatch);

  const goTo = (step: DemoStepId, pushHistory = true) => {
    dispatchRouteAction({ type: "go_to_step", step, pushHistory });
  };

  const goBack = () => {
    if (state.stepHistory.length === 0) {
      pendingStateNavigationRef.current = false;
      state.dispatch({ type: "go_to_step", step: "profile_picker", pushHistory: false });
      router.push(getPathForStep("profile_picker"), { scroll: false });
      return;
    }

    dispatchRouteAction({ type: "go_back" });
  };

  const pickProfile = (profileId: IndustryProfileId) => {
    if (state.currentStep !== "profile_picker" && state.industryProfileId !== profileId) {
      const confirmed = window.confirm("Сменить профиль бизнеса и сбросить сценарный прогресс?");
      if (!confirmed) return;
      dispatchRouteAction({ type: "change_profile", profileId });
      return;
    }

    if (state.currentStep === "profile_picker") {
      dispatchRouteAction({ type: "select_profile", profileId });
    }
  };

  const connectSource = (sourceId: ConnectedSourceId) => {
    state.dispatch({ type: "connect_source", sourceId });
  };

  const setReserveMode = (mode: ReserveMode) => {
    state.dispatch({ type: "select_reserve_mode", mode });
  };

  const showToast = (message: string | null) => {
    state.dispatch({ type: "show_toast", message });
  };

  return (
    <main className="prototype-page">
      <section className="phone-stage">
        <div className="app-shell">
          <ScreenRenderer
            connectSource={connectSource}
            dispatchRouteAction={dispatchRouteAction}
            goBack={goBack}
            goTo={goTo}
            pickProfile={pickProfile}
            setReserveMode={setReserveMode}
            showToast={showToast}
            state={state}
            viewModel={viewModel}
          />
          {state.featureToast ? (
            <div className="phone-toast" role="status">
              <span>{state.featureToast}</span>
              <button onClick={() => showToast(null)} type="button">
                Закрыть
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
