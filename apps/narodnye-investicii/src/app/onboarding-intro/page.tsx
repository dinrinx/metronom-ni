"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ProgressDots } from "@/components/ui/ProgressDots";
import { useAppState } from "@/state/AppStateContext";
import { GrowthAnimation } from "./_components/GrowthAnimation";
import { OrbitAnimation } from "./_components/OrbitAnimation";
import { TicketAnimation } from "./_components/TicketAnimation";

interface Slide {
  title: string;
  body: string;
  cta: string;
}

const SLIDES: Slide[] = [
  {
    title: "Народные инвестиции — путь бизнеса целиком",
    body: "Экосистема ведёт от идеи до масштабирования и кризисов — на каждом этапе свой набор инструментов.",
    cta: "Продолжить",
  },
  {
    title: "Не кредит — доверие сообщества",
    body: "Банк не оценивает прошлое. Жизнеспособность идеи доказывают люди, которые в неё поверили.",
    cta: "Продолжить",
  },
  {
    title: "Донатеры получают не доход, а причастность",
    body: "Скидки, промокоды, ранний доступ — ощущение совместного запуска, а не просто перевод денег.",
    cta: "Начать",
  },
];

export default function OnboardingIntroPage() {
  const router = useRouter();
  const { dispatch } = useAppState();
  const [step, setStep] = useState(0);
  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  function goToSandbox() {
    dispatch({ type: "SET_SEEN_INTRO" });
    router.push("/sandbox");
  }

  function handleNext() {
    if (isLast) {
      goToSandbox();
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <div className="flex min-h-screen md:min-h-0 md:h-full justify-center bg-surface">
      <div className="flex w-full max-w-md flex-col bg-white md:h-full">
        <div className="flex items-center justify-between px-6 pt-6">
          <ProgressDots total={SLIDES.length} current={step} />
          {!isLast && (
            <button onClick={goToSandbox} className="text-caption text-text-secondary underline underline-offset-4">
              Пропустить
            </button>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-center px-6 py-10">
          {step === 0 ? (
            <GrowthAnimation key={step} />
          ) : step === 1 ? (
            <OrbitAnimation key={step} />
          ) : (
            <TicketAnimation key={step} />
          )}
          <h1 className="text-h1 text-ink">{slide.title}</h1>
          <p className="mt-4 text-body text-text-secondary">{slide.body}</p>
        </div>

        <div className="px-6 pb-8">
          <Button fullWidth onClick={handleNext}>
            {slide.cta}
          </Button>
        </div>
      </div>
    </div>
  );
}
