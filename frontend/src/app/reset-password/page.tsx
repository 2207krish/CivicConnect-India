"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import AuthSplit from "@/components/layout/AuthSplit";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { civicImages } from "@/config/media";
import { apiResetPassword } from "@/lib/auth-client";

const formSchema = z
  .object({
    email: z.string().email("Enter a valid email address"),
    otp: z.string(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include one uppercase letter")
      .regex(/[0-9]/, "Include one number"),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetValues = z.infer<typeof formSchema>;

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <section className="py-16">
          <Container className="text-sm text-slate-500">Loading reset form...</Container>
        </section>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState("");
  const token = searchParams.get("token") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: searchParams.get("email")?.trim().toLowerCase() ?? "",
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetValues) {
    setFormError("");
    if (!token && !/^\d{6}$/.test(values.otp)) {
      setFormError("Enter the 6-digit token from your email.");
      return;
    }
    try {
      await apiResetPassword({
        email: values.email,
        otp: values.otp || undefined,
        token: token || undefined,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      router.replace("/login?reset=1");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Password reset failed.");
    }
  }

  return (
    <AuthSplit
      image={civicImages.night}
      eyebrow="New password"
      title="Enter the email token and choose a new password."
    >
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--saffron)]">
        Reset password
      </p>
      <h1 className="font-display mt-3 text-4xl text-[var(--navy)]">Set a new password</h1>
      <p className="mt-3 text-slate-600">
        Check your inbox for the CivicConnect reset token. Then choose a password
        with at least 8 characters, one uppercase letter and one number.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5 rounded-[28px] border border-[#e5dccb] bg-white p-6 shadow-[0_20px_50px_rgba(20,32,51,0.08)]"
      >
        <Input label="Email ID" type="email" error={errors.email?.message} {...register("email")} />
        <Input
          label="6-digit email token"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          error={errors.otp?.message}
          {...register("otp")}
        />
        <Input label="New password" type="password" error={errors.password?.message} {...register("password")} />
        <Input
          label="Confirm new password"
          type="password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving password..." : "Save password and continue"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        Need a new token?{" "}
        <Link href="/forgot-password" className="font-semibold text-[var(--saffron)]">
          Send again
        </Link>
      </p>
    </AuthSplit>
  );
}
