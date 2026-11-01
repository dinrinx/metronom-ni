import { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="md:flex md:min-h-screen md:items-center md:justify-center md:bg-zinc-300 md:p-6">
      <div className="md:relative md:h-[844px] md:w-[390px] md:overflow-hidden md:rounded-[60px] md:border-[14px] md:border-neutral-900 md:bg-neutral-900 md:shadow-2xl md:[transform:translateZ(0)]">
        <div className="pointer-events-none absolute inset-x-0 top-2 z-20 hidden justify-center md:flex">
          <div className="h-6 w-32 rounded-full bg-neutral-900" />
        </div>

        <div className="h-full w-full bg-white md:overflow-y-auto md:rounded-[46px] md:pt-11">{children}</div>

        <div className="pointer-events-none absolute inset-x-0 bottom-2 z-20 hidden justify-center md:flex">
          <div className="h-1.5 w-32 rounded-full bg-neutral-900/80" />
        </div>
      </div>
    </div>
  );
}
