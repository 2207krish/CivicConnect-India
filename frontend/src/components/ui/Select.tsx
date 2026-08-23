import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, className, id, children, ...props },
  ref
) {
  const selectId = id ?? props.name;

  return (
    <label className="block space-y-2" htmlFor={selectId}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        id={selectId}
        ref={ref}
        className={cn(
          "w-full rounded-2xl border border-[#e5dccb] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--saffron)] focus:ring-4 focus:ring-amber-100",
          error && "border-red-400 focus:border-red-500 focus:ring-red-100",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
});

export default Select;
