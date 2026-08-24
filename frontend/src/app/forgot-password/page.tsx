"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthSplit from "@/components/layout/AuthSplit";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { civicImages } from "@/config/media";
import { apiForgotPassword } from "@/lib/auth-client";
import { forgotPasswordSchema } from "@/lib/validators";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string }>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: { email: string }) {
    setFormError("");
    try {
      await apiForgotPassword(values.email);
      router.push(`/reset-password?email=${encodeURIComponent(values.email.trim().toLowerCase())}`);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Could not send the reset token.");
    }
  }

  return (
    <AuthSplit
      image={civicImages.jaipur}
      eyebrow="Account recovery"
      title="Reset the password for your citizen account."
    >
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--saffron)]">
        Forgot password
      </p>
      <h1 className="font-display mt-3 text-4xl text-[var(--navy)]">Get a reset token</h1>
      <p className="mt-3 text-slate-600">
        Enter the email you registered with. We will send a 6-digit token and a
        reset link to that inbox.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5 rounded-[28px] border border-[#e5dccb] bg-white p-6 shadow-[0_20px_50px_rgba(20,32,51,0.08)]"
      >
        <Input
          label="Email ID"
          type="email"
          placeholder="you@gmail.com"
          error={errors.email?.message}
          {...register("email")}
        />
        {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending token..." : "Email reset token"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-[var(--saffron)]">
          Back to login
        </Link>
      </p>
    </AuthSplit>
  );
}
