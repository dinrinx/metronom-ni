import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  suffix?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ suffix, error, className = "", ...props }, ref) => (
    <div>
      <div
        className={`flex items-center rounded-md bg-surface px-4 py-[18px] ${
          error ? "ring-2 ring-red" : "focus-within:ring-2 focus-within:ring-ink"
        }`}
      >
        <input
          ref={ref}
          className={`w-full bg-transparent text-[18px] font-semibold text-ink placeholder:text-text-secondary placeholder:font-normal outline-none disabled:text-text-secondary ${className}`}
          {...props}
        />
        {suffix && <span className="ml-2 shrink-0 text-[15px] text-text-secondary">{suffix}</span>}
      </div>
      {error && <p className="mt-1.5 text-caption text-red">{error}</p>}
    </div>
  ),
);
Input.displayName = "Input";
