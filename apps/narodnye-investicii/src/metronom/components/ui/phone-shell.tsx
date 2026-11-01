import type { ReactNode } from "react";

type PhoneShellProps = {
  children: ReactNode;
};

export function PhoneShell({ children }: PhoneShellProps) {
  return (
    <div className="phone-frame">
      <div className="phone-status">
        <span className="phone-time">9:41</span>
        <span className="phone-dynamic-island" />
        <div className="phone-status-icons" aria-hidden="true">
          <svg width="18" height="12" viewBox="0 0 18 12">
            <rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor" />
            <rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor" />
            <rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor" />
            <rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor" />
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12">
            <path
              d="M8 10.5 5.6 8.1a3.4 3.4 0 0 1 4.8 0L8 10.5Zm0-5.2a6.4 6.4 0 0 0-4.5 1.9L1.8 5.5a8.8 8.8 0 0 1 12.4 0l-1.7 1.7A6.4 6.4 0 0 0 8 5.3Z"
              fill="currentColor"
            />
          </svg>
          <svg width="26" height="12" viewBox="0 0 26 12">
            <rect
              x="0.5"
              y="0.5"
              width="21"
              height="11"
              rx="3.5"
              stroke="currentColor"
              fill="none"
              opacity=".4"
            />
            <rect x="2" y="2" width="16" height="8" rx="2" fill="currentColor" />
            <path d="M23 4v4a2.4 2.4 0 0 0 0-4Z" fill="currentColor" opacity=".4" />
          </svg>
        </div>
      </div>
      {children}
    </div>
  );
}
