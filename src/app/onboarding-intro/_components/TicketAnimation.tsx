const WIDTH = 208;
const HEIGHT = 128;
const NOTCH = 30;

export function TicketAnimation() {
  return (
    <div className="mb-8 flex h-64 w-full items-center justify-center rounded-2xl bg-surface">
      <div className="ticket-pop" style={{ width: WIDTH, height: HEIGHT }}>
        <div className="ticket-idle relative h-full w-full">
          <div className="h-full w-full rounded-xl" style={{ backgroundColor: "var(--accent-red)" }} />

          <span
            className="absolute rounded-full bg-surface"
            style={{ width: NOTCH, height: NOTCH, top: "50%", left: 0, marginTop: -NOTCH / 2, marginLeft: -NOTCH / 2 }}
          />
          <span
            className="absolute rounded-full bg-surface"
            style={{ width: NOTCH, height: NOTCH, top: "50%", right: 0, marginTop: -NOTCH / 2, marginRight: -NOTCH / 2 }}
          />

          <span
            className="absolute rounded-full"
            style={{
              width: 40,
              height: 40,
              top: "50%",
              left: "38%",
              marginTop: -20,
              marginLeft: -20,
              backgroundColor: "rgba(255,255,255,0.9)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
