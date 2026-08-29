import Image from "next/image";
import Link from "next/link";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src="/logo.png"
        alt="CivicConnect India"
        width={44}
        height={44}
        className="h-11 w-11 rounded-full object-cover ring-1 ring-white/20"
        priority
      />
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
