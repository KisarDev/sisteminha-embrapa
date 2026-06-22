import { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
  className?: string;
  padding?: "sm" | "md" | "lg";
}>;

const paddingStyles = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function Card({ children, className, padding = "md" }: CardProps) {
  return (
    <div
      className={`
        rounded-[var(--radius-lg)] bg-[var(--color-surface)]
        border border-[var(--color-border)]
        shadow-[var(--shadow-sm)]
        ${paddingStyles[padding]}
        ${className ?? ""}
      `.trim()}
    >
      {children}
    </div>
  );
}
