import { TextareaHTMLAttributes, forwardRef } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <textarea
          ref={ref}
          className={`
            w-full rounded-[var(--radius-md)]
            border px-3 py-2 text-sm text-[var(--color-text)]
            placeholder:text-[var(--color-text-tertiary)]
            transition-colors duration-150
            bg-white resize-y
            ${error ? "border-[var(--color-danger)]" : "border-[var(--color-border)] hover:border-[var(--color-border-hover)]"}
            focus:border-[var(--color-border-focus)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10
            disabled:opacity-40 disabled:pointer-events-none
            ${className ?? ""}
          `.trim()}
          {...props}
        />
        {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
