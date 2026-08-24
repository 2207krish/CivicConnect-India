"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthSplit from "@/components/layout/AuthSplit";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { civicImages } from "@/config/media";
import { useAuth } from "@/context/AuthContext";
import { CITIES_BY_STATE, INDIAN_STATES, lookupPincode } from "@/data/locations";
import { registerSchema, type RegisterValues } from "@/lib/validators";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      address: {
        line1: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
      },
    },
  });

  const selectedState = watch("address.state");
  const cities = CITIES_BY_STATE[selectedState] ?? [];

  async function goToAddress() {
    const valid = await trigger(["name", "email", "phone", "password", "confirmPassword"]);
    if (valid) setStep(2);
  }

  async function onSubmit(values: RegisterValues) {
    setFormError("");
    try {
      const result = await registerUser({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        address: values.address,
      });
      router.push(`/verify-email?email=${encodeURIComponent(result.email)}`);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Registration failed.");
    }
  }

  function handlePincode(value: string) {
    setValue("address.pincode", value, { shouldValidate: value.length === 6 });
    const match = lookupPincode(value);
    if (match) {
      setValue("address.area", match.area, { shouldValidate: true });
      setValue("address.city", match.city, { shouldValidate: true });
      setValue("address.state", match.state, { shouldValidate: true });
    }
  }

  return (
    <AuthSplit
      wide
      image={civicImages.jaipur}
      eyebrow="New citizen"
      title="Register once. Reach the civic body nearest to your home."
    >
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--saffron)]">
        Citizen registration
      </p>
      <h1 className="font-display mt-3 text-4xl text-[var(--navy)]">
        Create your account
      </h1>
      <p className="mt-3 text-slate-600">
        We need your personal details and address, then a one-time token is
        emailed to you. The portal stays locked until that token is verified.
      </p>

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <span className={step === 1 ? "font-semibold text-[var(--saffron)]" : "text-slate-500"}>
          1. Personal details
        </span>
        <span className="text-slate-300">/</span>
        <span className={step === 2 ? "font-semibold text-[var(--saffron)]" : "text-slate-500"}>
          2. Residential address
        </span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-500">3. Email token</span>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5 rounded-[28px] border border-[#e5dccb] bg-white p-6 shadow-[0_20px_50px_rgba(20,32,51,0.08)]"
      >
          {step === 1 ? (
            <>
              <Input label="Full name" placeholder="Anita Sharma" error={errors.name?.message} {...register("name")} />
              <Input
                label="Email ID"
                type="email"
                placeholder="anita@email.com"
                hint="A 6-digit verification token will be sent to this address"
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                label="Mobile number"
                type="tel"
                placeholder="9876543210"
                error={errors.phone?.message}
                {...register("phone")}
              />
              <Input
                label="Password"
                type="password"
                hint="At least 8 characters, with one uppercase letter and one number"
                error={errors.password?.message}
                {...register("password")}
              />
              <Input
                label="Confirm password"
                type="password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
              <Button type="button" className="w-full" onClick={goToAddress}>
                Continue to address
              </Button>
            </>
          ) : (
            <>
              <Input
                label="House / street address"
                placeholder="14, Barakhamba Road"
                error={errors.address?.line1?.message}
                {...register("address.line1")}
              />
              <Input
                label="PIN code"
                placeholder="110001"
                error={errors.address?.pincode?.message}
                {...register("address.pincode", {
                  onChange: (event) => handlePincode(event.target.value),
                })}
              />
              <Input
                label="Locality / area"
                placeholder="Connaught Place"
                error={errors.address?.area?.message}
                {...register("address.area")}
              />
              <Select
                label="State / UT"
                error={errors.address?.state?.message}
                {...register("address.state", {
                  onChange: () => setValue("address.city", ""),
                })}
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Select>
              {cities.length > 0 ? (
                <Select label="City" error={errors.address?.city?.message} {...register("address.city")}>
                  <option value="">Select city</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input
                  label="City"
                  placeholder="Your city"
                  error={errors.address?.city?.message}
                  {...register("address.city")}
                />
              )}
              {formError ? (
                <p className="text-sm text-red-600">
                  {formError}{" "}
                  {formError.toLowerCase().includes("already exists") ? (
                    <Link href="/forgot-password" className="font-semibold text-[var(--saffron)]">
                      Forgot password?
                    </Link>
                  ) : null}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending verification token..." : "Register and email token"}
                </Button>
              </div>
            </>
          )}
        </form>

      <p className="mt-6 text-sm text-slate-600">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-[var(--saffron)]">
          Login
        </Link>
        {" · "}
        <Link href="/forgot-password" className="font-semibold text-[var(--saffron)]">
          Forgot password?
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
