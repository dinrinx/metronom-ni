import { ReactNode } from "react";

interface ScreenProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  withBottomNav?: boolean;
  className?: string;
}

export function Screen({ children, header, footer, withBottomNav, className = "" }: ScreenProps) {
  return (
    <div className="flex min-h-screen justify-center bg-surface">
      <div className="flex w-full max-w-md flex-col bg-white">
        {header && <div className="px-6 pt-6">{header}</div>}
        <div className={`flex-1 px-6 py-6 ${withBottomNav ? "pb-28" : ""} ${className}`}>{children}</div>
        {footer && <div className="sticky bottom-0 border-t border-border-default/60 bg-white px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
