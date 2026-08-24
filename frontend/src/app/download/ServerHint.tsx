"use client";

import { useEffect, useState } from "react";

export default function ServerHint() {
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  if (!origin) return null;

  return (
    <p className="mt-6 rounded-2xl bg-[#fff6ea] px-4 py-3 text-sm text-slate-600">
      In the app, set <span className="font-semibold text-[var(--navy)]">CivicConnect server URL</span>{" "}
      to <span className="font-mono text-[var(--saffron)]">{origin}</span> so email tokens and
      tracking stay live with this website.
    </p>
  );
}
