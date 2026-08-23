"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AuthSplit from "@/components/layout/AuthSplit";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { civicImages } from "@/config/media";
import { getComplaintByTrackingId } from "@/lib/storage";

export default function TrackPage() {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState("");
  const [error, setError] = useState("");

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const complaint = getComplaintByTrackingId(trackingId);
    if (!complaint) {
      setError("No complaint found for this ID. Check the code and try again.");
      return;
    }
    router.push(`/complaints/${complaint.trackingId}`);
  }

  return (
    <AuthSplit
      image={civicImages.traffic}
      eyebrow="Public tracking"
      title="Follow a complaint from the street to the civic desk."
    >
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--saffron)]">
        Status
      </p>
      <h1 className="font-display mt-3 text-4xl text-[var(--navy)]">
        Track your complaint
      </h1>
      <p className="mt-3 text-slate-600">
        Enter the CivicConnect tracking ID you received after the complaint was
        emailed to the civic body. You do not need to log in.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-5 rounded-[28px] border border-[#e5dccb] bg-white p-6 shadow-[0_20px_50px_rgba(20,32,51,0.08)]"
      >
        <Input
          label="Tracking ID"
          placeholder="CCI-NEW-20260823-ROAD"
          value={trackingId}
          onChange={(event) => {
            setTrackingId(event.target.value);
            setError("");
          }}
          error={error}
        />
        <Button type="submit" className="w-full">
          View status
        </Button>
      </form>

      <p className="mt-6 text-sm text-slate-500">
        Demo IDs: CCI-NEW-20260823-ROAD and CCI-NEW-20260823-LITE
      </p>
    </AuthSplit>
  );
}
