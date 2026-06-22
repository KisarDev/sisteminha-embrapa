type BadgeVariant = "info" | "warning" | "danger" | "success" | "neutral";

type BadgeProps = {
  variant?: BadgeVariant;
  children: React.ReactNode;
};

const variantStyles: Record<BadgeVariant, string> = {
  neutral: "bg-[var(--color-primary-soft)] text-[var(--color-text-secondary)]",
  info: "bg-[var(--color-info-soft)] text-[var(--color-info)]",
  warning: "bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
  danger: "bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
  success: "bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
};

export function Badge({ variant = "neutral", children }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
        ${variantStyles[variant]}
      `.trim()}
    >
      {children}
    </span>
  );
}
