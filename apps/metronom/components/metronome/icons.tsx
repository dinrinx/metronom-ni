import type { SVGProps } from "react";

function IconBase(props: SVGProps<SVGSVGElement>) {
  return <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props} />;
}

export function MetronomeGlyph({ color = "#EF3124", armColor = color }: { color?: string; armColor?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M7 17h6l-2.2-14h-1.6L7 17Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M4.5 17h11" stroke={color} strokeWidth="1.5" />
      <path
        d="M10 12.5 13 6"
        stroke={armColor}
        strokeWidth="1.5"
        style={{ transformOrigin: "10px 13px", animation: "metro-swing 1.6s ease-in-out infinite" }}
      />
    </svg>
  );
}

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase width="18" height="18" viewBox="0 0 24 24" {...props}>
      <path d="m9 6 6 6-6 6" />
    </IconBase>
  );
}

export function BackIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase width="18" height="18" viewBox="0 0 24 24" {...props}>
      <path d="m15 18-6-6 6-6" />
    </IconBase>
  );
}

export function InfoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase width="18" height="18" viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
      <path d="M12 10v5" strokeWidth="1.5" />
      <path d="M12 7.5h.01" strokeWidth="2.5" />
    </IconBase>
  );
}

export function TickSquareIcon({ color = "#8FEE52" }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" fill={color} />
      <path d="m8 12 2.6 2.7L16 9.8" stroke="#1D1D1B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase width="20" height="20" viewBox="0 0 24 24" {...props}>
      <path d="M15 17H9a2 2 0 0 1-2-2v-3.3c0-2.8 1.4-4.6 4.2-5.3V5.5a.8.8 0 1 1 1.6 0v.9C15.6 7.1 17 8.9 17 11.7V15a2 2 0 0 1-2 2Z" />
      <path d="M10.2 18.4a2 2 0 0 0 3.6 0" />
    </IconBase>
  );
}

export function LockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase width="18" height="18" viewBox="0 0 24 24" {...props}>
      <rect x="5" y="10" width="14" height="10" rx="3" strokeWidth="1.5" />
      <path d="M8.5 10V8.5a3.5 3.5 0 1 1 7 0V10" strokeWidth="1.5" />
    </IconBase>
  );
}

export function DocumentIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase width="18" height="18" viewBox="0 0 24 24" {...props}>
      <path d="M8 3.5h6l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 7 19V5A1.5 1.5 0 0 1 8.5 3.5Z" strokeWidth="1.5" />
      <path d="M14 3.5V8h4" strokeWidth="1.5" />
    </IconBase>
  );
}

export function ShieldCheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase width="18" height="18" viewBox="0 0 24 24" {...props}>
      <path d="M12 3.5 18 6v5.5c0 4.1-2.5 7.1-6 9-3.5-1.9-6-4.9-6-9V6l6-2.5Z" strokeWidth="1.5" />
      <path d="m9.2 11.8 1.9 1.9 3.6-4" strokeWidth="1.5" />
    </IconBase>
  );
}

export function BankIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase width="22" height="22" viewBox="0 0 24 24" {...props}>
      <path d="M4 9.5 12 5l8 4.5" strokeWidth="1.5" />
      <path d="M6 10v7.5M10 10v7.5M14 10v7.5M18 10v7.5" strokeWidth="1.5" />
      <path d="M4 19.5h16" strokeWidth="1.5" />
    </IconBase>
  );
}

export function FolderIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase width="22" height="22" viewBox="0 0 24 24" {...props}>
      <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7H10l1.4 1.5H18.5A1.5 1.5 0 0 1 20 10v7.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5V8.5Z" strokeWidth="1.5" />
    </IconBase>
  );
}

export function CashboxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase width="22" height="22" viewBox="0 0 24 24" {...props}>
      <rect x="4" y="8" width="16" height="10" rx="2.5" strokeWidth="1.5" />
      <path d="M7 8V6.5h10V8" strokeWidth="1.5" />
      <path d="M12 11.5v3" strokeWidth="1.5" />
      <path d="M10.5 13h3" strokeWidth="1.5" />
    </IconBase>
  );
}

export function CoffeeCupIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase width="24" height="24" viewBox="0 0 24 24" {...props}>
      <path d="M6 9.5h9.5a2 2 0 0 1 2 2v1.5a5 5 0 0 1-5 5H10a4 4 0 0 1-4-4V9.5Z" strokeWidth="1.6" />
      <path d="M15.5 10.5h1.2a2.3 2.3 0 1 1 0 4.6h-.6" strokeWidth="1.6" />
      <path d="M7 20h10" strokeWidth="1.6" />
      <path d="M9.2 4.8c.8.8.8 1.9 0 2.7M12.2 4.2c1 1 1 2.5 0 3.5" strokeWidth="1.4" />
    </IconBase>
  );
}

export function BeautySparkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase width="24" height="24" viewBox="0 0 24 24" {...props}>
      <path d="M12 4.5 13.8 9l4.7 1.7-4.7 1.7L12 17l-1.8-4.6-4.7-1.7L10.2 9 12 4.5Z" strokeWidth="1.6" />
      <path d="m18.3 4.8.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" strokeWidth="1.4" />
      <path d="m6 15.2.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z" strokeWidth="1.4" />
    </IconBase>
  );
}

export function StorefrontIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase width="24" height="24" viewBox="0 0 24 24" {...props}>
      <path d="M5.5 8.5 7 5.5h10l1.5 3" strokeWidth="1.6" />
      <path d="M4.5 8.5h15v2.2a2.3 2.3 0 0 1-2.3 2.3H6.8a2.3 2.3 0 0 1-2.3-2.3V8.5Z" strokeWidth="1.6" />
      <path d="M6.5 13v5.5h11V13" strokeWidth="1.6" />
      <path d="M10 18.5v-3.8h4v3.8" strokeWidth="1.6" />
    </IconBase>
  );
}

export function HomeOutlineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase width="22" height="22" viewBox="0 0 24 24" {...props}>
      <path d="m4.5 10.2 7.5-5.7 7.5 5.7" strokeWidth="1.5" />
      <path d="M7 10.7v8h10v-8" strokeWidth="1.5" />
    </IconBase>
  );
}

export function ClockOutlineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase width="22" height="22" viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="7.5" strokeWidth="1.5" />
      <path d="M12 8.2v4.2l2.8 1.8" strokeWidth="1.5" />
    </IconBase>
  );
}

export function WalletOutlineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase width="22" height="22" viewBox="0 0 24 24" {...props}>
      <path d="M5.5 7.5h11.6A1.4 1.4 0 0 1 18.5 9v8a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4.5 17V9A1.5 1.5 0 0 1 6 7.5Z" strokeWidth="1.5" />
      <path d="M15.5 12.2h3.8v3.1h-3.8a1.6 1.6 0 1 1 0-3.1Z" strokeWidth="1.5" />
      <path d="M7 7V6.4A1.4 1.4 0 0 1 8.4 5h8.8" strokeWidth="1.5" />
    </IconBase>
  );
}

export function GridOutlineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase width="22" height="22" viewBox="0 0 24 24" {...props}>
      <rect x="5" y="5" width="5.5" height="5.5" rx="1.2" strokeWidth="1.5" />
      <rect x="13.5" y="5" width="5.5" height="5.5" rx="1.2" strokeWidth="1.5" />
      <rect x="5" y="13.5" width="5.5" height="5.5" rx="1.2" strokeWidth="1.5" />
      <rect x="13.5" y="13.5" width="5.5" height="5.5" rx="1.2" strokeWidth="1.5" />
    </IconBase>
  );
}

export function ChatOutlineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase width="22" height="22" viewBox="0 0 24 24" {...props}>
      <path d="M6.5 7.5h11a2.5 2.5 0 0 1 2.5 2.5v5a2.5 2.5 0 0 1-2.5 2.5h-6.3l-3.7 2v-2H6.5A2.5 2.5 0 0 1 4 15V10a2.5 2.5 0 0 1 2.5-2.5Z" strokeWidth="1.5" />
    </IconBase>
  );
}

export function LeaseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase width="22" height="22" viewBox="0 0 24 24" {...props}>
      <path d="M5 9.5h14v7.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9.5Z" strokeWidth="1.5" />
      <path d="M7.5 9.5V7.4A1.4 1.4 0 0 1 8.9 6h6.2a1.4 1.4 0 0 1 1.4 1.4v2.1" strokeWidth="1.5" />
      <path d="M9 13h6" strokeWidth="1.5" />
    </IconBase>
  );
}

export function SwapHorizontalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase width="22" height="22" viewBox="0 0 24 24" {...props}>
      <path d="M6 9h11" strokeWidth="1.5" />
      <path d="m14 6 3 3-3 3" strokeWidth="1.5" />
      <path d="M18 15H7" strokeWidth="1.5" />
      <path d="m10 12-3 3 3 3" strokeWidth="1.5" />
    </IconBase>
  );
}

export function NotificationDot() {
  return <span className="notification-dot" aria-hidden="true" />;
}
