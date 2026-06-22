type AlertVariant = "success" | "error" | "warning" | "info";

type AlertBannerProps = {
  variant?: AlertVariant;
  children: React.ReactNode;
  onDismiss?: () => void;
};

const variantStyles: Record<AlertVariant, string> = {
  success:
    "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
  error:
    "bg-[var(--color-danger-soft)] text-[var(--color-danger)] border-[var(--color-danger)]/20",
  warning:
    "bg-[var(--color-warning-soft)] text-[var(--color-warning)] border-[var(--color-warning)]/20",
  info:
    "bg-[var(--color-info-soft)] text-[var(--color-info)] border-[var(--color-info)]/20",
};

const icons: Record<AlertVariant, string> = {
  success: "✓",
  error: "✕",
  warning: "!",
  info: "i",
};

export function AlertBanner({ variant = "info", children, onDismiss }: AlertBannerProps) {
  return (
    <div
      className={`
        flex items-start gap-3 rounded-[var(--radius-md)] border px-4 py-3 text-sm
        ${variantStyles[variant]}
      `.trim()}
    >
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-current text-white text-xs font-bold">
        {icons[variant]}
      </span>
      <div className="flex-1">{children}</div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
          aria-label="Fechar"
        >
          ✕
        </button>
      )}
    </div>
  );
}
