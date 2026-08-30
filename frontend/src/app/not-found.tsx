import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found — CivicConnect India",
};

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center py-20">
      <Container className="text-center">
        <div className="mx-auto max-w-lg">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
            <svg
              className="h-10 w-10 text-[var(--saffron)]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--saffron)]">
            404 — Not found
          </p>
          <h1 className="font-display mt-3 text-4xl text-[var(--navy)]">
            This page doesn&rsquo;t exist
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            The page you&rsquo;re looking for may have been moved or removed.
            Check the URL, or use the links below to get back on track.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/">Go to home page</Button>
            <Button variant="outline" href="/track">
              Track a complaint
            </Button>
            <Button variant="outline" href="/complaints/new">
              File a complaint
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
