import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, className, id, ...props },
  ref
) {
  const textareaId = id ?? props.name;

  return (
    <label className="block space-y-2" htmlFor={textareaId}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        id={textareaId}
        ref={ref}
        className={cn(
          "min-h-32 w-full rounded-2xl border border-[#e5dccb] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--saffron)] focus:ring-4 focus:ring-amber-100",
          error && "border-red-400 focus:border-red-500 focus:ring-red-100",
          className
        )}
        {...props}
      />
      {error ? (
        <span className="text-xs text-red-600">{error}</span>
      ) : hint ? (
        <span className="text-xs text-slate-500">{hint}</span>
      ) : null}
    </label>
  );
});

export default Textarea;
