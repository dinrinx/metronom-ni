"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DemoState, IndustryProfileId } from "@/domain/types";
import { demoReducer, type DemoAction } from "@/domain/events/reducer";
import { createInitialState } from "@/lib/demo/fixtures";

type DemoStore = DemoState & {
  dispatch: (action: DemoAction) => void;
  resetDemoForProfile: (profileId: IndustryProfileId) => void;
};

const STORAGE_KEY = "metronome-demo-state";
const SCHEMA_VERSION = 2;

function withDispatch(state: DemoState): DemoStore {
  return {
    ...state,
    dispatch: () => undefined,
    resetDemoForProfile: () => undefined,
  };
}

const defaultState = createInitialState("horeca");

export const useDemoStore = create<DemoStore>()(
  persist(
    (set) => ({
      ...withDispatch(defaultState),
      dispatch: (action) => {
        set((state) => ({
          ...demoReducer(state, action),
          dispatch: state.dispatch,
          resetDemoForProfile: state.resetDemoForProfile,
        }));
      },
      resetDemoForProfile: (profileId) => {
        set((state) => ({
          ...withDispatch(createInitialState(profileId)),
          dispatch: state.dispatch,
          resetDemoForProfile: state.resetDemoForProfile,
        }));
      },
    }),
    {
      name: STORAGE_KEY,
      version: SCHEMA_VERSION,
      migrate: (persistedState, version) => {
        if (typeof persistedState !== "object" || persistedState === null) {
          return withDispatch(defaultState);
        }

        if (version !== SCHEMA_VERSION) {
          const record = persistedState as Partial<DemoStore>;
          const profileId = record.industryProfileId ?? "horeca";
          return withDispatch(createInitialState(profileId));
        }

        const record = persistedState as Partial<DemoStore>;
        const profileId = record.industryProfileId ?? "horeca";
        const baseState = withDispatch(createInitialState(profileId));
        const nextState = {
          ...baseState,
          ...record,
          currentStep: baseState.currentStep,
          stepHistory: baseState.stepHistory,
        };

        return nextState;
      },
      partialize: (state) => ({
        schemaVersion: state.schemaVersion,
        industryProfileId: state.industryProfileId,
        providerMode: state.providerMode,
        scenarioId: state.scenarioId,
        businessStatus: state.businessStatus,
        loginStatus: state.loginStatus,
        connectedSources: state.connectedSources,
        obligations: state.obligations,
        cashEvents: state.cashEvents,
        envelopes: state.envelopes,
        reserveRule: state.reserveRule,
        preparedAction: state.preparedAction,
        clarificationChoice: state.clarificationChoice,
        clarificationApplied: state.clarificationApplied,
        completedEvents: state.completedEvents,
        currentAccountsTotal: state.currentAccountsTotal,
        committedTotal: state.committedTotal,
        safeToSpend: state.safeToSpend,
        campaignCommittedSlice: state.campaignCommittedSlice,
        forecastHorizonDays: state.forecastHorizonDays,
        processingIndex: state.processingIndex,
        lastRecalculatedAt: state.lastRecalculatedAt,
        recalculationHistory: state.recalculationHistory,
        auditTrail: state.auditTrail,
        selectedEnvelopeId: state.selectedEnvelopeId,
        llmExplanation: state.llmExplanation,
        llmExplanationSource: state.llmExplanationSource,
        featureToast: state.featureToast,
      }),
    },
  ),
);

export type DemoStoreState = ReturnType<typeof useDemoStore.getState>;
