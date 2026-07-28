import { MapPinned } from "lucide-react";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="rounded-xl bg-blue-600 p-2 text-white">
        <MapPinned className="h-6 w-6" />
      </div>

      <div>
        <h1 className="text-lg font-bold">
          CivicConnect
        </h1>

        <p className="text-xs text-muted-foreground">
          India
        </p>
      </div>
    </Link>
  );
}