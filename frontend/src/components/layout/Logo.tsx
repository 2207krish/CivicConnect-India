import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
        C
      </div>

      <div className="flex flex-col">
        <span className="text-lg font-bold text-slate-900">
          CivicConnect
        </span>

        <span className="text-xs text-slate-500">
          India
        </span>
      </div>
    </Link>
  );
}