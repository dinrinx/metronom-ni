import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProgressDots } from "@/components/ui/ProgressDots";
import { Textarea } from "@/components/ui/Textarea";

export interface StrategyAnswers {
  whatHappened: string;
  mistakes: string;
  changed: string;
  amount: string;
  amountFor: string;
}

const TITLES = ["Что произошло?", "Какие ошибки были допущены?", "Что уже изменено?", "Сколько нужно и на что?"];

interface Props {
  step: number;
  answers: StrategyAnswers;
  onChange: (patch: Partial<StrategyAnswers>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StrategyFormScreen({ step, answers, onChange, onNext, onBack }: Props) {
  const canProceed =
    step === 0
      ? answers.whatHappened.trim().length > 0
      : step === 1
        ? answers.mistakes.trim().length > 0
        : step === 2
          ? answers.changed.trim().length > 0
          : answers.amount.trim().length > 0 && answers.amountFor.trim().length > 0;

  return (
    <div className="flex flex-col px-6 py-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-2xl leading-none text-ink" aria-label="Назад">
          ‹
        </button>
        <ProgressDots total={TITLES.length} current={step} />
      </div>

      <h2 className="mt-8 mb-4 text-h2 text-ink">{TITLES[step]}</h2>

      {step === 0 && (
        <Textarea
          autoFocus
          placeholder="Опиши своими словами, без прикрас"
          value={answers.whatHappened}
          onChange={(e) => onChange({ whatHappened: e.target.value })}
        />
      )}
      {step === 1 && (
        <Textarea
          autoFocus
          placeholder="Что бы ты сделал(а) иначе"
          value={answers.mistakes}
          onChange={(e) => onChange({ mistakes: e.target.value })}
        />
      )}
      {step === 2 && (
        <Textarea
          autoFocus
          placeholder="Конкретные шаги, которые уже предприняты"
          value={answers.changed}
          onChange={(e) => onChange({ changed: e.target.value })}
        />
      )}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          <Input
            autoFocus
            inputMode="numeric"
            placeholder="150 000"
            suffix="₽"
            value={answers.amount}
            onChange={(e) => onChange({ amount: e.target.value })}
          />
          <Input
            placeholder="На что пойдут деньги"
            value={answers.amountFor}
            onChange={(e) => onChange({ amountFor: e.target.value })}
          />
        </div>
      )}

      <div className="mt-8">
        <Button fullWidth disabled={!canProceed} onClick={onNext}>
          {step === TITLES.length - 1 ? "К предпросмотру" : "Далее"}
        </Button>
      </div>
    </div>
  );
}
