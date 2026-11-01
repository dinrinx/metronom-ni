import { TextareaHTMLAttributes, forwardRef } from "react";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = "", ...props }, ref) => (
    <textarea
      ref={ref}
      rows={4}
      className={`w-full resize-none rounded-md bg-surface px-4 py-[18px] text-[16px] text-ink placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-ink ${className}`}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
