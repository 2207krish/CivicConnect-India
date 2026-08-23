"use client";

import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import CivicBodyCard from "@/components/civic/CivicBodyCard";
import Protected from "@/components/auth/Protected";
import { useAuth } from "@/context/AuthContext";
import { assignHomeCivicBodies, formatAddress } from "@/lib/matching";

export default function WelcomePage() {
  return (
    <Protected>
      <WelcomeContent />
    </Protected>
  );
}

function WelcomeContent() {
  const { user } = useAuth();
  if (!user) return null;

  const matches = assignHomeCivicBodies(user.address);

  return (
    <section className="py-16">
      <Container>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--saffron)]">Account created</p>
        <h1 className="font-display mt-2 text-4xl text-[var(--navy)]">Welcome, {user.name}</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Based on <strong>{formatAddress(user.address)}</strong>, these are the
          civic desks that will receive your complaints. Electricity issues go to
          the power utility, water issues to the water board, and roads, garbage
          or sanitation to the municipal body.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {matches.map((match, index) => (
            <CivicBodyCard key={match.body.id} match={match} highlight={index === 0} />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/complaints/new">File your first complaint</Button>
          <Button variant="outline" href="/dashboard">
            Go to dashboard
          </Button>
        </div>
      </Container>
    </section>
  );
}
