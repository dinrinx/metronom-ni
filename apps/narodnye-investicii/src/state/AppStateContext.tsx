"use client";

import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from "react";
import { initialAppState } from "@/lib/mockData";
import type { AppState, BusinessProfile, Campaign, IndustryId, SandboxInputs, SandboxResult } from "@/types";

const STORAGE_KEY = "kontur-doveria-state";

type Action =
  | { type: "HYDRATE"; state: AppState }
  | { type: "SET_SEEN_INTRO" }
  | { type: "SWITCH_PROFILE"; id: IndustryId }
  | { type: "SET_ACTIVE_PROFILE_ID"; id: IndustryId }
  | { type: "COMPLETE_ONBOARDING" }
  | { type: "UPDATE_ACTIVE_PROFILE"; patch: Partial<BusinessProfile> }
  | { type: "SET_SANDBOX_INPUTS"; patch: Partial<SandboxInputs> }
  | { type: "SET_SANDBOX_RESULT"; result: SandboxResult }
  | { type: "ADD_CAMPAIGN"; campaign: Campaign }
  | { type: "UPDATE_CAMPAIGN"; id: string; patch: Partial<Campaign> };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;
    case "SET_SEEN_INTRO":
      return { ...state, hasSeenIntro: true };
    case "SWITCH_PROFILE":
      return { ...state, activeProfileId: action.id, hasSeenIntro: true, hasOpenedAccount: true };
    case "SET_ACTIVE_PROFILE_ID":
      return { ...state, activeProfileId: action.id };
    case "COMPLETE_ONBOARDING":
      return { ...state, hasOpenedAccount: true };
    case "UPDATE_ACTIVE_PROFILE": {
      const profile = state.profiles[state.activeProfileId];
      return {
        ...state,
        profiles: {
          ...state.profiles,
          [state.activeProfileId]: { ...profile, ...action.patch },
        },
      };
    }
    case "SET_SANDBOX_INPUTS": {
      const profile = state.profiles[state.activeProfileId];
      const base: SandboxInputs = profile.sandboxInputs ?? {
        niche: null,
        city: "",
        revenue: "",
        expenses: "",
        avgCheck: "",
        clients: "",
      };
      return {
        ...state,
        profiles: {
          ...state.profiles,
          [state.activeProfileId]: { ...profile, sandboxInputs: { ...base, ...action.patch } },
        },
      };
    }
    case "SET_SANDBOX_RESULT": {
      const profile = state.profiles[state.activeProfileId];
      return {
        ...state,
        profiles: {
          ...state.profiles,
          [state.activeProfileId]: { ...profile, sandboxResult: action.result },
        },
      };
    }
    case "ADD_CAMPAIGN": {
      const profile = state.profiles[state.activeProfileId];
      return {
        ...state,
        profiles: {
          ...state.profiles,
          [state.activeProfileId]: { ...profile, campaigns: [action.campaign, ...profile.campaigns] },
        },
      };
    }
    case "UPDATE_CAMPAIGN": {
      const profile = state.profiles[state.activeProfileId];
      return {
        ...state,
        profiles: {
          ...state.profiles,
          [state.activeProfileId]: {
            ...profile,
            campaigns: profile.campaigns.map((c) => (c.id === action.id ? { ...c, ...action.patch } : c)),
          },
        },
      };
    }
    default:
      return state;
  }
}

interface AppStateContextValue {
  state: AppState;
  dispatch: Dispatch<Action>;
  activeProfile: BusinessProfile;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialAppState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: "HYDRATE", state: JSON.parse(saved) as AppState });
    } catch {
      // corrupt localStorage — keep seed data
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const activeProfile = state.profiles[state.activeProfileId];

  return (
    <AppStateContext.Provider value={{ state, dispatch, activeProfile }}>{children}</AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
