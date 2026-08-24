"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Protected from "@/components/auth/Protected";
import CivicBodyCard from "@/components/civic/CivicBodyCard";
import Container from "@/components/layout/Container";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { getCategory } from "@/data/categories";
import { assignHomeCivicBodies, formatAddress } from "@/lib/matching";
import { apiListComplaints } from "@/lib/complaints-client";
import { statusLabel, statusTone } from "@/lib/status";
import AdSlot from "@/components/ads/AdSlot";
import type { Complaint } from "@/types";

export default function DashboardPage() {
  return (
    <Protected>
      <DashboardContent />
    </Protected>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    if (!user) return;
    apiListComplaints()
      .then((result) => setComplaints(result.complaints))
      .catch(() => setComplaints([]));
  }, [user]);
  const matches = user ? assignHomeCivicBodies(user.address) : [];

  if (!user) return null;

  const openCount = complaints.filter(
    (item) => item.status !== "resolved" && item.status !== "rejected"
  ).length;

  return (
    <section className="py-16">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--saffron)]">Citizen dashboard</p>
            <h1 className="font-display mt-2 text-4xl text-[var(--navy)]">Hello, {user.name}</h1>
            <p className="mt-2 text-slate-600">{formatAddress(user.address)}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/complaints/new">New complaint</Button>
            <Button variant="outline" href="/profile">
              Update address
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Card className="p-6 hover:translate-y-0">
            <p className="text-sm text-slate-500">Total complaints</p>
            <p className="mt-2 text-3xl font-bold">{complaints.length}</p>
          </Card>
          <Card className="p-6 hover:translate-y-0">
            <p className="text-sm text-slate-500">Open complaints</p>
            <p className="mt-2 text-3xl font-bold">{openCount}</p>
          </Card>
          <Card className="p-6 hover:translate-y-0">
            <p className="text-sm text-slate-500">Linked civic desks</p>
            <p className="mt-2 text-3xl font-bold">{matches.length}</p>
          </Card>
        </div>

        <h2 className="mt-12 text-2xl font-bold">Your nearest civic bodies</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {matches.map((match) => (
            <CivicBodyCard key={match.body.id} match={match} />
          ))}
        </div>

        <AdSlot slotKey="dashboard" />

        <div className="mt-12 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your complaints</h2>
          <Link href="/track" className="text-sm font-medium text-[var(--saffron)]">
            Track by ID
          </Link>
        </div>

        {complaints.length === 0 ? (
          <Card className="mt-6 p-8 text-center hover:translate-y-0">
            <p className="text-slate-600">You have not filed a complaint yet.</p>
            <Button className="mt-4" href="/complaints/new">
              File your first complaint
            </Button>
          </Card>
        ) : (
          <div className="mt-6 space-y-4">
            {complaints.map((complaint) => {
              const category = getCategory(complaint.categoryId);
              return (
                <Link key={complaint.id} href={`/complaints/${complaint.trackingId}`}>
                  <Card className="p-6 hover:translate-y-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-500">
                          {complaint.trackingId}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold">{complaint.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {category?.title} · {complaint.civicBodyName}
                        </p>
                      </div>
                      <Badge className={statusTone(complaint.status)}>
                        {statusLabel(complaint.status)}
                      </Badge>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
