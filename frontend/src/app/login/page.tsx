"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthSplit from "@/components/layout/AuthSplit";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { civicImages } from "@/config/media";
import { useAuth } from "@/context/AuthContext";
import { apiGoogleLogin, AuthApiError } from "@/lib/auth-client";
import { renderGoogleButton } from "@/lib/google-auth";
import { loginSchema, type LoginValues } from "@/lib/validators";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <section className="py-16">
          <Container className="text-sm text-slate-500">Loading login...</Container>
        </section>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, refreshUser } = useAuth();
  const [formError, setFormError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Mount the Google button once the component is ready
  useEffect(() => {
    if (!CLIENT_ID || !googleBtnRef.current) return;

    renderGoogleButton(
      googleBtnRef.current,
      CLIENT_ID,
      handleGoogleToken,
      (error) => setFormError(error.message)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CLIENT_ID]);

  async function handleGoogleToken(idToken: string) {
    setFormError("");
    setGoogleLoading(true);
    try {
      await apiGoogleLogin(idToken);
      await refreshUser();
      router.push(searchParams.get("next") || "/dashboard");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Google sign-in failed.");
    } finally {
      setGoogleLoading(false);
    }
  }

  async function onSubmit(values: LoginValues) {
    setFormError("");
    try {
      await login(values.email, values.password);
      router.push(searchParams.get("next") || "/dashboard");
    } catch (error) {
      if (error instanceof AuthApiError && error.code === "UNVERIFIED") {
        router.push(
          `/verify-email?email=${encodeURIComponent(error.email || values.email)}`
        );
        return;
      }
      setFormError(error instanceof Error ? error.message : "Login failed.");
    }
  }

  return (
    <AuthSplit
      image={civicImages.gateway}
      eyebrow="Citizen access"
      title="Sign in to reach your nearest civic desk."
    >
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--saffron)]">
        Welcome back
      </p>
      <h1 className="font-display mt-3 text-4xl text-[var(--navy)]">Login</h1>
      <p className="mt-3 text-slate-600">
        Use a verified email to file a complaint or review cases you have already sent.
      </p>

      <div className="mt-8 space-y-5 rounded-[28px] border border-[#e5dccb] bg-white p-6 shadow-[0_20px_50px_rgba(20,32,51,0.08)]">
        {/* Google Sign-In Button */}
        {CLIENT_ID && (
          <div className="space-y-3">
            <div
              ref={googleBtnRef}
              id="google-signin-btn"
              className="flex w-full items-center justify-center"
              aria-label="Sign in with Google"
            />
            {googleLoading && (
              <p className="text-center text-sm text-slate-500">Signing in with Google…</p>
            )}
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              or continue with email
              <span className="h-px flex-1 bg-slate-200" />
            </div>
          </div>
        )}

        {/* Email + Password form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email ID"
            type="email"
            placeholder="citizen@demo.in"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Password"
            type="password"
            error={errors.password?.message}
            {...register("password")}
          />
          <div className="text-right">
            <Link href="/forgot-password" className="text-sm font-semibold text-[var(--saffron)]">
              Forgot password?
            </Link>
          </div>
          {searchParams.get("reset") === "1" ? (
            <p className="text-sm text-emerald-700">
              Password updated. Sign in with your new password.
            </p>
          ) : null}
          {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login to portal"}
          </Button>
        </form>
      </div>

      <div className="mt-6 rounded-2xl bg-[#f7efe3] p-4 text-sm text-[var(--navy)]">
        Demo citizen: <strong>citizen@demo.in</strong> / <strong>Demo@123</strong>
      </div>

      <p className="mt-6 text-sm text-slate-600">
        New here?{" "}
        <Link href="/register" className="font-semibold text-[var(--saffron)]">
          Register with your address
        </Link>
      </p>
      <p className="mt-3 text-sm text-slate-600">
        Prefer the phone app?{" "}
        <Link href="/download" className="font-semibold text-[var(--saffron)]">
          Download the Android APK
        </Link>
      </p>
    </AuthSplit>
  );
}
