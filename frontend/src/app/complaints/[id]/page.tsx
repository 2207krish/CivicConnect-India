"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Mail } from "lucide-react";

import Container from "@/components/layout/Container";
import StatusTimeline from "@/components/complaint/StatusTimeline";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { getCategory } from "@/data/categories";
import { buildMailto } from "@/lib/email";
import { formatAddress } from "@/lib/matching";
import { apiResolveComplaint, apiTrackComplaint } from "@/lib/complaints-client";
import { statusLabel, statusTone } from "@/lib/status";
import AdSlot from "@/components/ads/AdSlot";
import type { Complaint, EmailDispatch } from "@/types";

export default function ComplaintDetailPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const [refresh, setRefresh] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [dispatch, setDispatch] = useState<EmailDispatch | null>(null);

  useEffect(() => {
    let active = true;
    apiTrackComplaint(decodeURIComponent(params.id))
      .then((result) => {
        if (!active) return;
        setComplaint(result.complaint);
        setDispatch(result.dispatch);
      })
      .catch(() => {
        if (active) setComplaint(null);
      })
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, [params.id, refresh]);
  const category = complaint ? getCategory(complaint.categoryId) : null;
  const isOwner = Boolean(user && complaint && user.id === complaint.userId);

  if (!loaded) {
    return (
      <section className="py-16">
        <Container className="text-sm text-slate-500">Loading complaint...</Container>
      </section>
    );
  }

  if (!complaint) {
    return (
      <section className="py-16">
        <Container className="max-w-2xl text-center">
          <h1 className="text-3xl font-bold">Complaint not found</h1>
          <p className="mt-3 text-slate-600">
            Check the tracking ID and try again. IDs look like CCI-NEW-20260823-ROAD.
          </p>
          <Button className="mt-6" href="/track">
            Track another complaint
          </Button>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16">
      <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <p className="text-sm font-semibold text-[var(--saffron)]">{complaint.trackingId}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">{complaint.title}</h1>
            <Badge className={statusTone(complaint.status)}>
              {statusLabel(complaint.status)}
            </Badge>
          </div>
          <p className="mt-3 text-slate-600">
            {category?.title} · Filed on{" "}
            {new Date(complaint.createdAt).toLocaleDateString("en-IN")}
          </p>

          <Card className="mt-8 p-6 hover:translate-y-0">
            <h2 className="text-lg font-semibold">Complaint details</h2>
            <p className="mt-4 whitespace-pre-wrap text-slate-700">{complaint.description}</p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <dt className="text-slate-500">Location</dt>
                <dd className="mt-1 font-medium">{formatAddress(complaint.address)}</dd>
              </div>
              {complaint.landmark ? (
                <div>
                  <dt className="text-slate-500">Landmark</dt>
                  <dd className="mt-1 font-medium">{complaint.landmark}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-slate-500">Citizen</dt>
                <dd className="mt-1 font-medium">
                  {complaint.citizenName}, {complaint.citizenPhone}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Sent to</dt>
                <dd className="mt-1 font-medium">{complaint.civicBodyEmail}</dd>
              </div>
            </dl>
            {complaint.photos.length > 0 ? (
              <div className="mt-6 flex gap-3">
                {complaint.photos.map((photo) => (
                  <img
                    key={photo.url || photo.name}
                    src={photo.url || photo.dataUrl}
                    alt={photo.name}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                ))}
              </div>
            ) : null}
          </Card>

          {dispatch ? (
            <Card className="mt-6 p-6 hover:translate-y-0">
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 text-blue-600" />
                <div>
                  <h2 className="text-lg font-semibold">Official email dispatch</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Sent to <strong>{dispatch.to}</strong> ({dispatch.toName}) on{" "}
                    {new Date(dispatch.sentAt).toLocaleString("en-IN")}.
                  </p>
                  <p className="mt-3 text-sm font-medium">{dispatch.subject}</p>
                  <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-xs text-slate-700">
                    {dispatch.body}
                  </pre>
                  <Button className="mt-4" variant="outline" href={buildMailto(dispatch)}>
                    Open in your email app
                  </Button>
                </div>
              </div>
            </Card>
          ) : null}
        </div>

        <aside className="space-y-6">
          <Card className="p-6 hover:translate-y-0">
            <h2 className="text-lg font-semibold">Tracking</h2>
            <div className="mt-5">
              <StatusTimeline current={complaint.status} events={complaint.timeline} />
            </div>
            {isOwner && complaint.status !== "resolved" ? (
              <Button
                className="mt-6 w-full"
                variant="outline"
                onClick={async () => {
                  await apiResolveComplaint(complaint.id);
                  setRefresh((value) => value + 1);
                }}
              >
                Confirm this is resolved
              </Button>
            ) : null}
          </Card>
          <Button variant="outline" href="/dashboard" className="w-full">
            Back to dashboard
          </Button>
        </aside>
      </Container>
      <Container className="pb-10">
        <AdSlot slotKey="complaint" />
      </Container>
    </section>
  );
}
