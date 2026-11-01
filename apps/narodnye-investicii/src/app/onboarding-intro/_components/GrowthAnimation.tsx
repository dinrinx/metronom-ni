export function GrowthAnimation() {
  return (
    <div className="mb-8 flex h-64 w-full items-center gap-2 rounded-2xl bg-surface px-7">
      <span
        className="growth-dot"
        style={{ width: 14, height: 14, backgroundColor: "var(--border-default)", ["--growth-delay" as string]: "0s" }}
      />
      <span className="growth-line" style={{ backgroundColor: "var(--border-default)", ["--growth-delay" as string]: "0.4s" }} />
      <span
        className="growth-dot"
        style={{ width: 52, height: 52, backgroundColor: "var(--text-secondary)", ["--growth-delay" as string]: "0.75s" }}
      />
      <span className="growth-line" style={{ backgroundColor: "var(--border-default)", ["--growth-delay" as string]: "1.15s" }} />
      <span
        className="growth-dot"
        style={{ width: 68, height: 68, backgroundColor: "var(--accent-red)", ["--growth-delay" as string]: "1.5s" }}
      />
    </div>
  );
}
