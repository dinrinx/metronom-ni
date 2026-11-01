"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppState } from "@/state/AppStateContext";

export default function RootPage() {
  const router = useRouter();
  const { state } = useAppState();

  useEffect(() => {
    if (!state.hasSeenIntro) {
      router.replace("/ni/onboarding-intro");
    } else if (!state.hasOpenedAccount) {
      router.replace("/ni/sandbox");
    } else {
      router.replace("/ni/dashboard");
    }
  }, [router, state.hasSeenIntro, state.hasOpenedAccount]);

  return <div className="min-h-screen bg-surface" />;
}
