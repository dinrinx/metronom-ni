import { Card } from "@/components/ui/Card";

export function BenchmarkCard({ userMargin, benchmark, industryLabel }: { userMargin: number; benchmark: number; industryLabel: string }) {
  const max = Math.max(userMargin, benchmark, 1) * 1.2;

  return (
    <Card>
      <p className="text-caption font-semibold uppercase text-text-secondary">Отраслевой бенчмарк</p>
      <p className="mt-1 text-caption text-text-secondary">Маржа твоего бизнеса против средней по нише «{industryLabel}»</p>

      <div className="mt-4 flex flex-col gap-3">
        <div>
          <div className="flex items-center justify-between text-caption text-text-secondary">
            <span>Ты</span>
            <span className="font-semibold text-ink">{userMargin}%</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-white">
            <div className="h-2 rounded-full bg-ink" style={{ width: `${(userMargin / max) * 100}%` }} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-caption text-text-secondary">
            <span>Средний по нише</span>
            <span className="font-semibold text-ink">{benchmark}%</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-white">
            <div className="h-2 rounded-full bg-red" style={{ width: `${(benchmark / max) * 100}%` }} />
          </div>
        </div>
      </div>
    </Card>
  );
}
