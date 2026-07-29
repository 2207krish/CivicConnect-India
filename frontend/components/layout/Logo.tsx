import Link from "next/link";
import { MapPinned } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="rounded-xl bg-blue-600 p-2 text-white shadow-lg">
        <MapPinned className="h-6 w-6" />
      </div>

      <div>
        <h1 className="text-lg font-bold tracking-tight">
          CivicConnect
        </h1>

        <p className="text-xs text-slate-500">
          India
        </p>
      </div>
    </Link>
  );
}