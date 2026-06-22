import { SelectHTMLAttributes, forwardRef } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, children, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <select
          ref={ref}
          className={`
            w-full rounded-[var(--radius-md)]
            border px-3 py-2 text-sm text-[var(--color-text)]
            transition-colors duration-150
            bg-white appearance-none
            ${error ? "border-[var(--color-danger)]" : "border-[var(--color-border)] hover:border-[var(--color-border-hover)]"}
            focus:border-[var(--color-border-focus)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10
            disabled:opacity-40 disabled:pointer-events-none
            ${className ?? ""}
          `.trim()}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
