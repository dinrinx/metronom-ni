interface Row {
  color: string;
  wireDelay: number;
  beadDelay: number;
  beadCount: number;
}

const ROWS: Row[] = [
  { color: "var(--border-default)", wireDelay: 0, beadDelay: 0.3, beadCount: 5 },
  { color: "var(--text-secondary)", wireDelay: 0.55, beadDelay: 0.85, beadCount: 4 },
  { color: "var(--accent-red)", wireDelay: 1.1, beadDelay: 1.4, beadCount: 3 },
];

const BEAD = 16;

export function AbacusAnimation() {
  return (
    <div className="mb-8 flex h-64 w-full flex-col items-center justify-center gap-9 rounded-2xl bg-surface px-9">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="relative w-full" style={{ height: BEAD }}>
          <div
            className="growth-line absolute left-0 top-1/2 w-full"
            style={{
              backgroundColor: "var(--border-default)",
              marginTop: -1,
              ["--growth-delay" as string]: `${row.wireDelay}s`,
            }}
          />
          {Array.from({ length: row.beadCount }).map((_, beadIndex) => {
            const left = 10 + (beadIndex * (80 / Math.max(row.beadCount - 1, 1)));
            return (
              <span
                key={beadIndex}
                className="growth-dot absolute rounded-full"
                style={{
                  top: "50%",
                  left: `${left}%`,
                  width: BEAD,
                  height: BEAD,
                  marginTop: -BEAD / 2,
                  marginLeft: -BEAD / 2,
                  backgroundColor: row.color,
                  ["--growth-delay" as string]: `${row.beadDelay + beadIndex * 0.08}s`,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
