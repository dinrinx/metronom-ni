const HEIGHT = 216;
const BIG = 72;
const RING_R = 82;
const DOT = 14;

const DOTS = [
  { angle: 0, color: "var(--accent-red)", delay: 0.45 },
  { angle: 60, color: "var(--border-default)", delay: 0.7 },
  { angle: 120, color: "var(--border-default)", delay: 0.95 },
  { angle: 180, color: "var(--border-default)", delay: 1.2 },
  { angle: 240, color: "var(--border-default)", delay: 1.45 },
  { angle: 300, color: "var(--border-default)", delay: 1.7 },
];

export function OrbitAnimation() {
  return (
    <div className="mb-8 w-full rounded-2xl bg-surface" style={{ height: HEIGHT }}>
      <div className="relative h-full w-full">
        <span
          className="growth-dot absolute rounded-full"
          style={{
            top: "50%",
            left: "50%",
            marginTop: -BIG / 2,
            marginLeft: -BIG / 2,
            width: BIG,
            height: BIG,
            backgroundColor: "var(--action-default)",
            ["--growth-delay" as string]: "0s",
          }}
        />
        {DOTS.map((dot) => (
          <div
            key={dot.angle}
            className="orbit-ring"
            style={{
              width: RING_R * 2,
              height: RING_R * 2,
              marginTop: -RING_R,
              marginLeft: -RING_R,
              ["--base-angle" as string]: `${dot.angle}deg`,
            }}
          >
            <span
              className="orbit-dot"
              style={{
                width: DOT,
                height: DOT,
                marginLeft: -DOT / 2,
                backgroundColor: dot.color,
                ["--growth-delay" as string]: `${dot.delay}s`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
