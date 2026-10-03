import type { ButtonHTMLAttributes } from "react";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  const base =
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-6 text-base font-medium transition-[color,background-color,transform] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40";
  const styles =
    variant === "primary"
      ? "bg-accent text-surface hover:bg-ink active:bg-ink motion-safe:enabled:active:scale-[0.98] disabled:hover:bg-accent"
      : "text-ink underline-offset-4 hover:underline active:bg-accent-soft";
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
