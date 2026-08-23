import Link from "next/link";
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-[var(--saffron)] text-white shadow-[0_12px_24px_rgba(196,92,20,0.28)] hover:-translate-y-0.5 hover:bg-[var(--primary-hover)]",
  secondary:
    "bg-[var(--navy)] text-white shadow-[0_12px_24px_rgba(11,27,51,0.22)] hover:-translate-y-0.5 hover:bg-[#13284a]",
  outline:
    "border border-[#d7cbb6] bg-white/80 text-[var(--navy)] shadow-sm hover:-translate-y-0.5 hover:border-[var(--saffron)] hover:text-[var(--saffron)]",
};

const baseClass =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400/70 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  href?: string;
}

export default function Button({
  children,
  className,
  variant = "primary",
  href,
  ...props
}: ButtonProps) {
  const classes = cn(baseClass, variants[variant], className);

  if (href) {
    const external = href.startsWith("http") || href.startsWith("mailto:");
    if (external) {
      return (
        <a href={href} className={classes}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
