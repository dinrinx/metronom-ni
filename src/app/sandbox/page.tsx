"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { computeSandboxResult } from "@/lib/sandboxCalc";
import { useAppState } from "@/state/AppStateContext";
import type { SandboxInputs } from "@/types";
import { CalculatingScreen } from "./_components/CalculatingScreen";
import { FormScreen } from "./_components/FormScreen";
import { RecommendScreen } from "./_components/RecommendScreen";
import { ResultScreen } from "./_components/ResultScreen";
import { StartScreen } from "./_components/StartScreen";

type Stage = "start" | "form" | "calculating" | "result" | "recommend";

const EMPTY_INPUTS: SandboxInputs = { niche: null, city: "", revenue: "", expenses: "", avgCheck: "", clients: "" };

export default function SandboxPage() {
  const router = useRouter();
  const { dispatch, activeProfile } = useAppState();
  const [stage, setStage] = useState<Stage>("start");
  const [formStep, setFormStep] = useState(0);
  const [inputs, setInputs] = useState<SandboxInputs>(activeProfile.sandboxInputs ?? EMPTY_INPUTS);

  function handleFormChange(patch: Partial<SandboxInputs>) {
    setInputs((prev) => ({ ...prev, ...patch }));
    if (patch.niche) dispatch({ type: "SET_ACTIVE_PROFILE_ID", id: patch.niche });
  }

  function handleFormNext() {
    if (formStep < 5) {
      setFormStep((s) => s + 1);
    } else {
      dispatch({ type: "SET_SANDBOX_INPUTS", patch: inputs });
      setStage("calculating");
    }
  }

  function handleFormBack() {
    if (formStep === 0) {
      setStage("start");
    } else {
      setFormStep((s) => s - 1);
    }
  }

  function handleCalculationDone() {
    const result = computeSandboxResult(inputs);
    dispatch({ type: "SET_SANDBOX_RESULT", result });
    setStage("result");
  }

  return (
    <div className="flex justify-center bg-surface md:h-full">
      <div className="w-full max-w-md bg-white md:h-full">
        {stage === "start" && <StartScreen onStart={() => setStage("form")} />}

        {stage === "form" && (
          <FormScreen
            step={formStep}
            values={inputs}
            onChange={handleFormChange}
            onNext={handleFormNext}
            onBack={handleFormBack}
          />
        )}

        {stage === "calculating" && <CalculatingScreen onDone={handleCalculationDone} />}

        {stage === "result" && activeProfile.sandboxResult && (
          <ResultScreen result={activeProfile.sandboxResult} onNext={() => setStage("recommend")} />
        )}

        {stage === "recommend" && inputs.niche && (
          <RecommendScreen niche={inputs.niche} onOpenAccount={() => router.push("/onboarding")} />
        )}
      </div>
    </div>
  );
}
