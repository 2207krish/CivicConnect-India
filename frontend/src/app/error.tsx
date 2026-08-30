"use client";

import { useEffect } from "react";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[CivicConnect] Unhandled error:", error);
  }, [error]);

  return (
    <section className="flex min-h-[60vh] items-center py-20">
      <Container className="text-center">
        <div className="mx-auto max-w-lg">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <svg
              className="h-10 w-10 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
          <h1 className="font-display mt-8 text-4xl text-[var(--navy)]">
            Something went wrong
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            An unexpected error occurred. This has been logged and our team will
            investigate. You can try again or go back to the home page.
          </p>
          {error.digest && (
            <p className="mt-2 text-sm text-slate-400">
              Error reference: {error.digest}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button onClick={reset}>Try again</Button>
            <Button variant="outline" href="/">
              Go to home page
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
