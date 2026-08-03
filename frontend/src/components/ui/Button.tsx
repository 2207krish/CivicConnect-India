import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

export default function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const variants = {
  primary:
    "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]",

  secondary:
    "bg-[var(--secondary)] text-white hover:opacity-90",

  outline:
    "border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--surface)]",
};

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}