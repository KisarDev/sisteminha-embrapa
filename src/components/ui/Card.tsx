import { PropsWithChildren } from "react";

export function Card({ children }: PropsWithChildren) {
  return <div className="rounded-lg border border-[var(--color-border)] bg-white p-4 shadow-sm">{children}</div>;
}
