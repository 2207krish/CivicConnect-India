"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AuthSplit from "@/components/layout/AuthSplit";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { civicImages } from "@/config/media";
import { useAuth } from "@/context/AuthContext";
import { apiSendVerification, apiVerificationInbox } from "@/lib/auth-client";

interface InboxMessage {
  to: string;
  subject: string;
  text: string;
  otp: string | null;
  verifyUrl: string | null;
  previewUrl: string | null;
  sentAt: string;
  delivery: "preview" | "smtp";
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <section className="py-16">
          <Container className="text-sm text-slate-500">Loading verification...</Container>
        </section>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail } = useAuth();

  const email = searchParams.get("email")?.trim().toLowerCase() ?? "";
  const token = searchParams.get("token") ?? "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [inbox, setInbox] = useState<InboxMessage | null>(null);
  const [busy, setBusy] = useState(false);
  const [linkBusy, setLinkBusy] = useState(Boolean(token && email));
  const linkStarted = useRef(false);

  async function loadInbox(forceResend = false) {
    if (!email) return;
    try {
      const result = await apiVerificationInbox(email);
      if (result.message && !forceResend) {
        setInbox(result.message);
        if (result.message.otp) setOtp(result.message.otp);
        return;
      }

      await apiSendVerification(email);
      const again = await apiVerificationInbox(email);
      setInbox(again.message);
      if (again.message?.otp) setOtp(again.message.otp);
    } catch (loadError) {
      if (!inbox) {
        setError(loadError instanceof Error ? loadError.message : "Could not load the token.");
      }
    }
  }

  async function submitToken(values: { otp?: string; token?: string }) {
    if (!email) {
      setError("Missing email address. Start again from registration.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      await verifyEmail({ email, ...values });
      router.replace("/welcome");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "That token could not be verified."
      );
    } finally {
      setBusy(false);
      setLinkBusy(false);
    }
  }

  useEffect(() => {
    void loadInbox();
    // Load or generate the mailbox message once for this email.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  useEffect(() => {
    if (!email || !token || linkStarted.current) return;
    linkStarted.current = true;
    void submitToken({ token });
  }, [email, token]);

  async function resend() {
    if (!email) return;
    setError("");
    try {
      await loadInbox(true);
    } catch (resendError) {
      setError(resendError instanceof Error ? resendError.message : "Could not resend the token.");
    }
  }

  return (
    <AuthSplit
      image={civicImages.mumbai}
      eyebrow="Secure access"
      title="Confirm the token and your citizen account opens."
    >
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--saffron)]">Step 3 of 3</p>
        <h1 className="font-display mt-3 text-4xl text-[var(--navy)]">Verify your email</h1>
        <p className="mt-3 text-slate-600">
          {email
            ? `A 6-digit token was emailed to ${email}. Open that inbox and enter the token here.`
            : "Enter the email you registered with."}
        </p>

        {inbox?.delivery === "smtp" ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-950">
            <p className="font-semibold">Token sent to your real inbox.</p>
            <p className="mt-2 leading-6">
              Check Gmail (and Spam / Promotions). The CivicConnect message
              includes the 6-digit token and a verify link. It expires in 15 minutes.
            </p>
          </div>
        ) : (
          <p className="mt-6 text-sm text-slate-500">
            If the email has not arrived, wait a minute and tap Resend token.
          </p>
        )}

        {linkBusy ? (
          <p className="mt-8 text-sm text-slate-500">Checking the link from your email...</p>
        ) : (
          <form
            className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            onSubmit={(event) => {
              event.preventDefault();
              void submitToken({ otp });
            }}
          >
            <Input
              label="6-digit email token"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
              error={error}
            />
            <Button type="submit" className="w-full" disabled={busy || otp.length !== 6}>
              {busy ? "Verifying..." : "Verify and open portal"}
            </Button>
            <button
              type="button"
              onClick={() => void resend()}
              className="w-full text-sm font-medium text-[var(--saffron)]"
            >
              Resend token
            </button>
          </form>
        )}
    </AuthSplit>
  );
}
