import Image from "next/image";
import Link from "next/link";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      id="top-left-logo"
      className="flex shrink-0 items-center gap-2.5 sm:gap-3 transition-opacity hover:opacity-95"
      aria-label="CivicConnect India Home"
    >
      <Image
        src="/logo.png"
        alt="CivicConnect India"
        width={44}
        height={44}
        className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover ring-2 ring-[var(--saffron)]/30 shadow-sm shrink-0"
        priority
        unoptimized
      />
      <div className="flex flex-col leading-none">
        <span
          className={`font-display text-base sm:text-lg font-bold tracking-tight ${
            light ? "text-white" : "text-[var(--navy)]"
          }`}
        >
          CivicConnect
        </span>
        <span
          className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] mt-0.5 ${
            light ? "text-amber-200" : "text-[var(--saffron)]"
          }`}
        >
          India
        </span>
      </div>
    </Link>
  );
}
