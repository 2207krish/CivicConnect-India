import type { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  Eye,
  Users,
  ShieldCheck,
  MapPin,
  FileText,
  TrendingUp,
} from "lucide-react";

import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import AdSlot from "@/components/ads/AdSlot";
import { civicImages } from "@/config/media";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `About Us · ${siteConfig.name}`,
  description:
    "CivicConnect India bridges the gap between citizens and municipal infrastructure, empowering communities to register, route, and track civic complaints across Indian cities.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    Icon: MapPin,
    title: "Address-Based Routing",
    description:
      "Enter your address and PIN code. CivicConnect matches the nearest municipal, electricity, water, or traffic desk and emails your complaint directly to the officer who can act.",
  },
  {
    Icon: FileText,
    title: "Tracked Complaints",
    description:
      "Every complaint receives a unique tracking ID. Share it with neighbours, councillors, or journalists. The ID follows your issue from filing to resolution.",
  },
  {
    Icon: Users,
    title: "Community Empowerment",
    description:
      "RWAs, ward committees, and individual residents use CivicConnect to build documented paper trails that make civic bodies accountable.",
  },
  {
    Icon: ShieldCheck,
    title: "Transparent & Non-Partisan",
    description:
      "We are not a government department. We do not decide complaints. We route them to the correct desk and give citizens the tools to follow up.",
  },
  {
    Icon: TrendingUp,
    title: "Escalation Pathways",
    description:
      "Our civic awareness guides explain how to escalate stalled complaints — from the ward office to the zonal commissioner, standing committee, and state grievance portals.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={civicImages.gateway}
          alt=""
          className="absolute inset-0 h-72 w-full object-cover opacity-30"
        />
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-[rgba(11,27,51,0.55)] to-[#f7f3ea]" />

        <Container className="relative py-20 pb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--saffron)]">
            About CivicConnect India
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-4xl text-[var(--navy)] md:text-5xl">
            Bridging the gap between citizens and civic infrastructure
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            CivicConnect India is a citizen grievance routing service that helps
            residents register civic issues, reach the nearest municipal or
            utility desk, and track complaints until they are resolved. We
            believe that every pothole, leaking pipe, and missing street light
            deserves a file number — not just a social media post.
          </p>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-[28px] border border-[#e5dccb] bg-white p-8 shadow-[0_16px_40px_rgba(20,32,51,0.06)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f7efe3]">
                <Target className="h-6 w-6 text-[var(--saffron)]" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-[var(--navy)]">
                Our Mission
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-slate-600">
                To make civic complaint filing accessible, trackable, and
                effective for every Indian citizen — regardless of which city
                they live in or which government portal exists. We match your
                address to the correct civic body, email your complaint with
                photographs and a tracking ID, and provide the knowledge to
                escalate when the system stalls. Our mission is to turn
                individual frustrations into documented, actionable files that
                municipal bodies cannot ignore.
              </p>
            </div>

            <div className="rounded-[28px] border border-[#e5dccb] bg-white p-8 shadow-[0_16px_40px_rgba(20,32,51,0.06)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f7efe3]">
                <Eye className="h-6 w-6 text-[var(--saffron)]" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-[var(--navy)]">
                Our Vision
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-slate-600">
                A future where every neighbourhood in India has a clear,
                documented channel to reach local authorities. Where a resident
                who reports a broken drain does not need to start from zero each
                time. Where ward committees, RWAs, and individual citizens have
                the tools and knowledge to hold civic bodies accountable — not
                through confrontation, but through consistent, tracked, and
                evidence-backed communication.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* How We Help */}
      <section className="bg-[#fffaf2] py-16">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--saffron)]">
            How we help
          </p>
          <h2 className="font-display mt-3 max-w-2xl text-3xl text-[var(--navy)]">
            From filing to resolution — tools that work for citizens
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {values.map(({ Icon, title, description }) => (
              <div
                key={title}
                className="rounded-[28px] border border-[#e5dccb] bg-white p-6 shadow-[0_16px_40px_rgba(20,32,51,0.06)] transition-shadow hover:shadow-[0_20px_50px_rgba(20,32,51,0.1)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7efe3]">
                  <Icon className="h-5 w-5 text-[var(--saffron)]" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[var(--navy)]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* E-E-A-T: Experience & Expertise */}
      <section className="py-16">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl text-[var(--navy)]">
            Built with civic expertise
          </h2>
          <div className="mt-6 space-y-6 text-[15px] leading-7 text-slate-600">
            <p>
              CivicConnect India was created by{" "}
              <strong className="text-[var(--navy)]">
                {siteConfig.developer.name}
              </strong>{" "}
              to solve a problem faced by millions of urban residents: knowing
              where to file a civic complaint. Indian cities are governed by a
              patchwork of municipal corporations, development authorities, water
              boards, electricity DISCOMs, and traffic police — each with
              overlapping jurisdictions. A resident who wants to report a broken
              street light may need to contact a different office than the one
              handling the pothole ten metres away.
            </p>
            <p>
              Our directory of civic bodies is maintained through public records,
              RTI responses, and verified government contacts. Every article in
              our{" "}
              <Link
                href="/learn"
                className="font-semibold text-[var(--saffron)] hover:underline"
              >
                civic awareness guide
              </Link>{" "}
              is written with reference to Indian municipal law, the 74th
              Constitutional Amendment, the RTI Act, electricity regulation, and
              solid waste management rules.
            </p>
            <p>
              We are transparent about what CivicConnect is and what it is not.
              We are <strong className="text-[var(--navy)]">not</strong> a
              government website. We do not investigate or resolve complaints. We
              are a routing and tracking service that places the right complaint
              on the right desk, with a paper trail that residents can use for
              escalation. Our{" "}
              <Link
                href="/privacy"
                className="font-semibold text-[var(--saffron)] hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/terms"
                className="font-semibold text-[var(--saffron)] hover:underline"
              >
                Terms of Service
              </Link>{" "}
              explain exactly how we handle data.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/complaints/new">Report an issue</Button>
            <Button variant="outline" href="/learn">
              Read the civic guide
            </Button>
            <Button variant="outline" href="/contact">
              Contact us
            </Button>
          </div>

          <AdSlot slotKey="learnIndex" />
        </Container>
      </section>
    </>
  );
}
