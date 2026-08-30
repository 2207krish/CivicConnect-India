"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { isProfileComplete } from "@/lib/user-utils";

export default function Protected({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-500">
          Loading your account...
        </div>
      }
    >
      <ProtectedGate>{children}</ProtectedGate>
    </Suspense>
  );
}

function ProtectedGate({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      const search = searchParams.toString();
      const next = search ? `${pathname}?${search}` : pathname;
      router.replace(`/login?next=${encodeURIComponent(next)}`);
      return;
    }
    if (!user.emailVerified) {
      router.replace(`/verify-email?email=${encodeURIComponent(user.email)}`);
      return;
    }
    if (!isProfileComplete(user) && pathname !== "/onboarding") {
      const search = searchParams.toString();
      const next = search ? `${pathname}?${search}` : pathname;
      router.replace(`/onboarding?next=${encodeURIComponent(next)}`);
      return;
    }
  }, [pathname, ready, router, searchParams, user]);

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-500">
        Loading your account...
      </div>
    );
  }

  if (!user || !user.emailVerified) {
    return null;
  }

  return <>{children}</>;
}
