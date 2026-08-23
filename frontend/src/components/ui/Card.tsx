import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-[#e5dccb] bg-white/90 p-8 shadow-[0_16px_40px_rgba(20,32,51,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(20,32,51,0.10)]",
        className
      )}
    >
      {children}
    </div>
  );
}