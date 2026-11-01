import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  inverse?: boolean;
}

export function Card({ inverse, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg p-[18px] ${inverse ? "bg-ink text-white" : "bg-surface text-ink"} ${className}`}
      {...props}
    />
  );
}
