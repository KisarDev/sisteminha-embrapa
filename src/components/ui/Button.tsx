import { ButtonHTMLAttributes } from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-md bg-[var(--color-primary)] px-4 py-2 text-white transition hover:opacity-90 ${props.className ?? ""}`.trim()}
    />
  );
}
