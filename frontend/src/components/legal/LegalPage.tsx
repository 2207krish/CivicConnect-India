import { ReactNode } from "react";
import Link from "next/link";

import Container from "@/components/layout/Container";

export function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <section className="py-16">
      <Container className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--saffron)]">
          {eyebrow}
        </p>
        <h1 className="font-display mt-3 text-4xl text-[var(--navy)]">{title}</h1>
        <p className="mt-3 text-sm text-slate-500">Last updated: {updated}</p>
        <div className="mt-8 rounded-[28px] border border-[#e5dccb] bg-white p-8 shadow-[0_16px_40px_rgba(20,32,51,0.06)]">
          {children}
        </div>
      </Container>
    </section>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="text-xl font-semibold text-[var(--navy)]">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-7 text-slate-600">{children}</div>
    </section>
  );
}

export function LegalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-[var(--saffron)] hover:underline">
      {children}
    </Link>
  );
}
