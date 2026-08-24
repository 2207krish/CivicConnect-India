"use client";

import { useEffect } from "react";
import { adsenseConfig, adsenseReady } from "@/config/adsense";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

interface AdSlotProps {
  slotKey: keyof typeof adsenseConfig.slots;
  format?: "horizontal" | "rectangle";
  className?: string;
}

export default function AdSlot({
  slotKey,
  format = "horizontal",
  className = "",
}: AdSlotProps) {
  const slot = adsenseConfig.slots[slotKey];
  const live = adsenseReady() && Boolean(slot);
  const minHeight = format === "rectangle" ? "250px" : "90px";

  useEffect(() => {
    if (!live) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense script may still be loading.
    }
  }, [live, slot]);

  return (
    <aside className={`my-8 ${className}`.trim()} aria-label="Advertisement">
      <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        Advertisement
      </p>
      <div
        className="overflow-hidden rounded-2xl border border-[#e5dccb] bg-[#fffaf2]"
        style={{ minHeight }}
      >
        {live ? (
          <ins
            className="adsbygoogle"
            style={{ display: "block", minHeight }}
            data-ad-client={adsenseConfig.client}
            data-ad-slot={slot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <div
            className="flex flex-col items-center justify-center px-4 text-center text-slate-500"
            style={{ minHeight }}
          >
            <p className="text-sm font-medium text-slate-600">Google AdSense space</p>
            <p className="mt-1 max-w-md text-xs leading-5">
              Ads will show here after you add your AdSense publisher ID and ad unit
              IDs in frontend/.env.local.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
