import { type Metadata } from "next";
import Features from "@/components/home/Features";
import Statistics from "@/components/home/Statistics";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Features — Why CivicConnect India?",
  description:
    "Discover how CivicConnect routes civic complaints to the right authority using PIN-code matching, email routing, and a transparent tracking system.",
};

export default function FeaturesPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-[var(--navy)] py-20 text-white">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
            Why this portal
          </p>
          <h1 className="font-display mt-4 text-5xl leading-tight lg:text-6xl">
            Built for every Indian citizen
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            CivicConnect is designed around the real path a civic complaint
            should take — citizen, nearest office, official email, and a
            trackable record.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/register">Get started free</Button>
            <Button
              variant="outline"
              href="/how-it-works"
              className="border-white/30 bg-white/10 text-white hover:border-amber-300 hover:text-amber-200"
            >
              See how it works →
            </Button>
          </div>
        </Container>
      </section>

      {/* Features grid */}
      <Features />

      {/* Statistics */}
      <Statistics />

      {/* CTA */}
      <section className="py-20">
        <Container className="text-center">
          <h2 className="font-display text-4xl text-[var(--navy)]">
            Start reporting today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Join citizens across India who are getting their civic complaints
            routed to the right authority.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/register">Create citizen account</Button>
            <Button variant="outline" href="/categories">
              Browse complaint categories
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
