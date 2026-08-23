import Link from "next/link";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--navy)] text-lg font-bold text-amber-300 shadow-lg shadow-slate-900/10">
        C
      </div>
      <div className="flex flex-col leading-tight">
        <span className={`font-display text-lg ${light ? "text-white" : "text-[var(--navy)]"}`}>
          CivicConnect
        </span>
        <span className={`text-[11px] uppercase tracking-[0.18em] ${light ? "text-amber-200" : "text-[var(--saffron)]"}`}>
          India
        </span>
      </div>
    </Link>
  );
}
