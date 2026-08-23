"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Protected({ children }: { children: React.ReactNode }) {
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
