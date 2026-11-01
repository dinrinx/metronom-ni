"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { calculateSafeToSpend, calculateTotalCommitted } from "@m/domain/finance/calculate-safe-to-spend";
import type { DemoAction } from "@m/domain/events/reducer";
import type { DemoState } from "@m/domain/types";
import { formatMoney, formatRuDate } from "@m/lib/formatting";
import { applyCampaignClosed, mergeBackerObligation } from "@m/lib/handoff/applyCampaignClosed";
import { clearHandoff, readHandoff } from "@m/lib/handoff/campaign-closed";

type Draft = { quantity: string; deadline: string; unitCost: string };

const EMPTY_DRAFT: Draft = { quantity: "", deadline: "", unitCost: "" };

const subscribe = () => () => {};
const getServerSnapshot = () => "";

function getSnapshot() {
  const event = readHandoff();
  return event ? JSON.stringify(event) : "none";
}

function toNumber(value: string) {
  const parsed = Number(value);
  return value.trim() !== "" && Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function CampaignHandoffScreen({
  state,
  dispatch,
  dispatchRouteAction,
}: {
  state: DemoState;
  dispatch: (action: DemoAction) => void;
  dispatchRouteAction: (action: DemoAction) => void;
}) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const event = useMemo(() => (snapshot === "" || snapshot === "none" ? null : readHandoff()), [snapshot]);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});

  const profileMismatch = event !== null && event.profileId !== state.industryProfileId;

  useEffect(() => {
    if (event && profileMismatch) {
      dispatch({ type: "change_profile", profileId: event.profileId });
    }
  }, [dispatch, event, profileMismatch]);

  const obligations = useMemo(() => {
    if (!event) return [];
    return applyCampaignClosed({
      ...event,
      rewards: event.rewards.map((reward, index) => {
        const draft = drafts[index];
        if (!draft) return reward;
        const quantity = reward.quantity ?? toNumber(draft.quantity);
        const deadline = reward.deadline ?? (draft.deadline || undefined);
        const unitCost = reward.unitCost ?? toNumber(draft.unitCost);
        return {
          title: reward.title,
          ...(quantity !== undefined ? { quantity } : {}),
          ...(deadline !== undefined ? { deadline } : {}),
          ...(unitCost !== undefined ? { unitCost } : {}),
        };
      }),
    });
  }, [drafts, event]);

  if (snapshot === "" || profileMismatch) {
    return <div className="screen-body" />;
  }

  if (!event) {
    return (
      <div className="screen-body">
        <h1 className="screen-title compact">Нет данных о закрытом сборе</h1>
        <p className="screen-copy">Закройте сбор в «Народных инвестициях», и он появится здесь.</p>
        <div className="push-bottom stack gap-sm">
          {/* /ni — другая зона, next/link туда не ведёт */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className="cta-button" href="/ni/campaigns">
            К сборам
          </a>
        </div>
      </div>
    );
  }

  const confirmedTotal = obligations
    .filter((item) => item.status === "confirmed")
    .reduce((sum, item) => sum + item.amount, 0);
  const hasAmbiguous = obligations.some((item) => item.status === "ambiguous");
  const shortfall = Math.max(0, event.goalAmount - event.raisedAmount);
  const underfunded = event.status === "не хватило" || shortfall > 0;
  const committedTotal = calculateTotalCommitted(mergeBackerObligation(state.obligations, obligations));
  const safeToSpend = calculateSafeToSpend(state.currentAccountsTotal, committedTotal);

  const setField = (index: number, field: keyof Draft, value: string) =>
    setDrafts((current) => ({
      ...current,
      [index]: { ...EMPTY_DRAFT, ...current[index], [field]: value },
    }));

  const confirm = () => {
    dispatchRouteAction({ type: "apply_campaign_handoff", campaignTitle: event.title, obligations });
    clearHandoff();
  };

  return (
    <div className="screen-body">
      <h1 className="screen-title compact">
        Сбор «{event.title}» закрыт. Пришло {formatMoney(event.raisedAmount)}
      </h1>
      <p className="screen-copy">
        Из них {formatMoney(confirmedTotal)} обещаны {event.supportersCount} бэкерам
      </p>
      {underfunded ? (
        <p className="screen-copy">
          Сбор не добран: не хватило {formatMoney(shortfall)} до цели {formatMoney(event.goalAmount)}.
        </p>
      ) : null}
      {hasAmbiguous ? (
        <p className="screen-copy">По части наград не хватает данных — заполните их, чтобы зарезервировать деньги.</p>
      ) : (
        <p className="screen-copy">Все награды распознаны.</p>
      )}

      <div className="fact-list-card">
        {obligations.map((item, index) => {
          const reward = event.rewards[index];
          if (!reward) return null;
          const draft = drafts[index] ?? { quantity: "", deadline: "", unitCost: "" };
          return (
            <div className="stack gap-sm" key={item.id}>
              <div className="row-between">
                <strong>{item.title}</strong>
                <span className="muted">
                  {item.status === "confirmed" ? formatMoney(item.amount) : "нужны данные"}
                </span>
              </div>
              {item.status === "confirmed" ? (
                <span className="muted">{item.dueDate ? `до ${formatRuDate(item.dueDate)}` : "без срока"}</span>
              ) : (
                <>
                  {reward.quantity === undefined ? (
                    <label className="field-card">
                      <span className="field-label">Сколько штук</span>
                      <input
                        className="field-input"
                        inputMode="numeric"
                        onChange={(e) => setField(index, "quantity", e.target.value)}
                        value={draft.quantity}
                      />
                    </label>
                  ) : null}
                  {reward.deadline === undefined ? (
                    <label className="field-card">
                      <span className="field-label">До какой даты</span>
                      <input
                        className="field-input"
                        onChange={(e) => setField(index, "deadline", e.target.value)}
                        type="date"
                        value={draft.deadline}
                      />
                    </label>
                  ) : null}
                  {reward.unitCost === undefined ? (
                    <label className="field-card">
                      <span className="field-label">Себестоимость за штуку, ₽</span>
                      <input
                        className="field-input"
                        inputMode="numeric"
                        onChange={(e) => setField(index, "unitCost", e.target.value)}
                        value={draft.unitCost}
                      />
                    </label>
                  ) : null}
                </>
              )}
            </div>
          );
        })}
        <div className="row-between strong-top">
          <span className="muted">Safe-to-Spend</span>
          <strong data-testid="handoff-safe-to-spend">{formatMoney(safeToSpend)}</strong>
        </div>
      </div>

      <div className="push-bottom stack gap-sm">
        <button className="cta-button" disabled={hasAmbiguous} onClick={confirm} type="button">
          Подтвердить и зарезервировать
        </button>
      </div>
    </div>
  );
}
