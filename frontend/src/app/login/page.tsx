"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, Mail, ArrowLeft, KeyRound } from "lucide-react";

import AuthSplit from "@/components/layout/AuthSplit";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { civicImages } from "@/config/media";
import { useAuth } from "@/context/AuthContext";
import { apiGoogleLogin, AuthApiError } from "@/lib/auth-client";
import { renderGoogleButton } from "@/lib/google-auth";
import { isProfileComplete } from "@/lib/user-utils";
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
  
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [pendingCredentials, setPendingCredentials] = useState<{ email: string; password: string } | null>(null);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const [formError, setFormError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const [clientId, setClientId] = useState(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""
  );

  // Fetch client ID at runtime if not inlined during build (e.g. on Railway/Docker)
  useEffect(() => {
    if (clientId) return;
    fetch("/api/auth/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.googleClientId) setClientId(data.googleClientId);
      })
      .catch(() => undefined);
  }, [clientId]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", otp: "" },
  });

  // Mount the Google button once the component is ready
  useEffect(() => {
    if (!clientId || !googleBtnRef.current || step !== "credentials") return;

    renderGoogleButton(
      googleBtnRef.current,
      clientId,
      handleGoogleToken,
      (error) => setFormError(error.message)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, step]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (step !== "otp") return;

    setCanResend(false);
    setResendCountdown(30);

    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step]);

  async function handleGoogleToken(idToken: string) {
    setFormError("");
    setGoogleLoading(true);
    try {
      const res = await apiGoogleLogin(idToken);
      await refreshUser();
      if (!isProfileComplete(res.user)) {
        const next = searchParams.get("next");
        router.push(next ? `/onboarding?next=${encodeURIComponent(next)}` : "/onboarding");
      } else {
        router.push(searchParams.get("next") || "/dashboard");
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Google sign-in failed.");
    } finally {
      setGoogleLoading(false);
    }
  }

  // Step 1: Submit email & password -> triggers OTP send
  async function onSubmitCredentials(values: LoginValues) {
    setFormError("");
    try {
      const res = await login(values.email, values.password);

      if (res.requiresOtp) {
        setPendingCredentials({ email: values.email, password: values.password });
        setOtp("");
        setOtpError("");
        setStep("otp");
        return;
      }

      if (res.user) {
        if (!isProfileComplete(res.user)) {
          const next = searchParams.get("next");
          router.push(next ? `/onboarding?next=${encodeURIComponent(next)}` : "/onboarding");
        } else {
          router.push(searchParams.get("next") || "/dashboard");
        }
      }
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

  // Step 2: Submit OTP to complete login
  async function onSubmitOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!pendingCredentials) return;
    if (otp.length !== 6) {
      setOtpError("Please enter the 6-digit OTP.");
      return;
    }

    setOtpError("");
    setOtpSubmitting(true);

    try {
      const res = await login(pendingCredentials.email, pendingCredentials.password, otp);
      if (res.user) {
        await refreshUser();
        if (!isProfileComplete(res.user)) {
          const next = searchParams.get("next");
          router.push(next ? `/onboarding?next=${encodeURIComponent(next)}` : "/onboarding");
        } else {
          router.push(searchParams.get("next") || "/dashboard");
        }
      }
    } catch (error) {
      setOtpError(error instanceof Error ? error.message : "Invalid or expired OTP.");
    } finally {
      setOtpSubmitting(false);
    }
  }

  // Resend OTP handler
  async function handleResendOtp() {
    if (!pendingCredentials || !canResend) return;
    setOtpError("");

    try {
      await login(pendingCredentials.email, pendingCredentials.password);
      setCanResend(false);
      setResendCountdown(30);
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : "Failed to resend OTP.");
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

      {/* Step 2: OTP Verification Card */}
      {step === "otp" && pendingCredentials ? (
        <div className="mt-8 space-y-6 rounded-[28px] border border-[#e5dccb] bg-white p-6 shadow-[0_20px_50px_rgba(20,32,51,0.08)] sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <KeyRound className="h-5 w-5 text-[var(--saffron)]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--navy)]">Enter 2-Step Login OTP</h2>
              <p className="text-xs text-slate-500">Security verification required</p>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-xs sm:text-sm text-amber-950">
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 mt-0.5 text-[var(--saffron)] shrink-0" />
              <div>
                <p className="font-medium">
                  A 6-digit login OTP was sent to: <strong>{pendingCredentials.email}</strong>
                </p>
                <p className="mt-1 text-amber-900/80 text-xs">
                  Please check your inbox (and Spam/Junk folder). Valid for 10 minutes.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmitOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[var(--navy)] mb-1.5">
                6-Digit Login OTP
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                autoFocus
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50/50 py-3.5 text-center text-2xl font-bold tracking-[8px] text-[var(--navy)] shadow-inner transition-all focus:border-[var(--saffron)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-200/40"
              />
              {otpError && <p className="mt-2 text-sm font-medium text-red-600">{otpError}</p>}
            </div>

            <Button
              type="submit"
              className="w-full py-3.5 text-base shadow-md"
              disabled={otpSubmitting || otp.length !== 6}
            >
              {otpSubmitting ? "Verifying OTP..." : "Verify OTP & Sign In"}
            </Button>

            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setStep("credentials");
                  setFormError("");
                }}
                className="inline-flex items-center gap-1 font-semibold text-slate-500 hover:text-[var(--navy)]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Change email / Back
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend}
                className={`font-semibold ${
                  canResend
                    ? "text-[var(--saffron)] hover:underline cursor-pointer"
                    : "text-slate-400 cursor-not-allowed"
                }`}
              >
                {canResend ? "Resend OTP" : `Resend in ${resendCountdown}s`}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Step 1: Email & Password Card */
        <div className="mt-8 space-y-5 rounded-[28px] border border-[#e5dccb] bg-white p-6 shadow-[0_20px_50px_rgba(20,32,51,0.08)]">
          {/* Google Sign-In Button */}
          {clientId && (
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
          <form onSubmit={handleSubmit(onSubmitCredentials)} className="space-y-5">
            <Input
              label="Email ID"
              type="email"
              placeholder="you@example.com"
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
              {isSubmitting ? "Checking password..." : "Continue to Login OTP"}
            </Button>
          </form>
        </div>
      )}

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
