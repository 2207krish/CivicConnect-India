"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserCheck,
  MapPin,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Phone,
  Home,
} from "lucide-react";

import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import CivicBodyCard from "@/components/civic/CivicBodyCard";
import { useAuth } from "@/context/AuthContext";
import { CITIES_BY_STATE, INDIAN_STATES, lookupPincode } from "@/data/locations";
import { assignHomeCivicBodies, formatAddress } from "@/lib/matching";
import { profileSchema, type ProfileValues } from "@/lib/validators";
import { isProfileComplete } from "@/lib/user-utils";

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-500">
          Loading onboarding...
        </div>
      }
    >
      <OnboardingFlow />
    </Suspense>
  );
}

function OnboardingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, ready, updateProfile, refreshUser } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [serverError, setServerError] = useState("");
  const [completed, setCompleted] = useState(false);

  const nextDestination = searchParams.get("next") || "/dashboard";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: {
        line1: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
      },
    },
  });

  // Prefill existing user info if available
  useEffect(() => {
    if (user) {
      if (user.name) setValue("name", user.name);
      if (user.phone) setValue("phone", user.phone);
      if (user.address?.line1) setValue("address.line1", user.address.line1);
      if (user.address?.area) setValue("address.area", user.address.area);
      if (user.address?.city) setValue("address.city", user.address.city);
      if (user.address?.state) setValue("address.state", user.address.state);
      if (user.address?.pincode) setValue("address.pincode", user.address.pincode);

      // If user profile is already fully complete and they didn't explicitly come to re-onboard, skip
      if (isProfileComplete(user) && !searchParams.get("edit")) {
        setCompleted(true);
      }
    }
  }, [user, setValue, searchParams]);

  const watchedState = watch("address.state");
  const watchedAddress = watch("address");
  const cities = CITIES_BY_STATE[watchedState] ?? [];

  // Live computed matched civic bodies
  const matchedBodies = assignHomeCivicBodies(watchedAddress);

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-500">
        Loading citizen profile...
      </div>
    );
  }

  if (!user) {
    router.replace(`/login?next=${encodeURIComponent("/onboarding")}`);
    return null;
  }

  function handlePincode(pincode: string) {
    setValue("address.pincode", pincode, { shouldValidate: pincode.length === 6 });
    const match = lookupPincode(pincode);
    if (match) {
      setValue("address.area", match.area, { shouldValidate: true });
      setValue("address.city", match.city, { shouldValidate: true });
      setValue("address.state", match.state, { shouldValidate: true });
    }
  }

  async function goToStep2() {
    const valid = await trigger(["name", "phone"]);
    if (valid) {
      setStep(2);
    }
  }

  async function goToStep3() {
    const valid = await trigger(["address.line1", "address.area", "address.city", "address.state", "address.pincode"]);
    if (valid) {
      setStep(3);
    }
  }

  async function onSaveProfile(values: ProfileValues) {
    setServerError("");
    try {
      await updateProfile(values);
      await refreshUser();
      setCompleted(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Failed to save profile.");
    }
  }

  if (completed) {
    const finalAddress = user.address?.line1 ? user.address : watchedAddress;
    const finalMatches = assignHomeCivicBodies(finalAddress);

    return (
      <section className="py-16">
        <Container className="max-w-3xl">
          <div className="rounded-[32px] border border-emerald-200 bg-white p-8 text-center shadow-xl sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <span className="mt-6 inline-block rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
              Onboarding Complete
            </span>

            <h1 className="font-display mt-4 text-3xl text-[var(--navy)] sm:text-4xl">
              You’re all set, {user.name}!
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Your contact number and home address have been registered. Complaints will be
              automatically routed to your nearest civic authorities:
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 text-sm text-slate-700">
              <MapPin className="h-4 w-4 text-[var(--saffron)] shrink-0" />
              <span>{formatAddress(finalAddress)}</span>
            </div>

            <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
              {finalMatches.slice(0, 4).map((match, idx) => (
                <CivicBodyCard key={match.body.id} match={match} highlight={idx === 0} />
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button href={nextDestination} className="px-8 py-3 text-base">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" href="/complaints/new">
                Report a civic issue now
              </Button>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-[#f7efe3]/60 via-[#fcfbf9] to-white py-12 sm:py-16">
      <Container className="max-w-3xl">
        {/* Header Badge & Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-amber-100/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-900 shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-[var(--saffron)]" />
            Citizen Setup & Verification
          </div>
          <h1 className="font-display mt-4 text-3xl text-[var(--navy)] sm:text-4xl">
            Complete your citizen profile
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-slate-600">
            CivicConnect routes your complaints directly to your local Municipal, Power, and Water
            desks. We need your phone number and address to match your area.
          </p>
        </div>

        {/* Step Indicator Tabs */}
        <div className="mt-8 flex items-center justify-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold transition-all ${
              step === 1
                ? "bg-[var(--navy)] text-white shadow-md"
                : "bg-white text-slate-600 border border-[#e5dccb] hover:bg-slate-50"
            }`}
          >
            <Phone className="h-4 w-4" />
            <span>1. Contact Details</span>
          </button>

          <span className="text-slate-300">→</span>

          <button
            type="button"
            onClick={goToStep2}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold transition-all ${
              step === 2
                ? "bg-[var(--navy)] text-white shadow-md"
                : "bg-white text-slate-600 border border-[#e5dccb] hover:bg-slate-50"
            }`}
          >
            <Home className="h-4 w-4" />
            <span>2. Home Address</span>
          </button>

          <span className="text-slate-300">→</span>

          <button
            type="button"
            onClick={goToStep3}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold transition-all ${
              step === 3
                ? "bg-[var(--navy)] text-white shadow-md"
                : "bg-white text-slate-600 border border-[#e5dccb] hover:bg-slate-50"
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>3. Review & Desks</span>
          </button>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit(onSaveProfile)}
          className="mt-8 rounded-[32px] border border-[#e5dccb] bg-white p-6 shadow-[0_20px_60px_rgba(20,32,51,0.08)] sm:p-10"
        >
          {/* Step 1: Personal & Phone */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-[var(--navy)] flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-[var(--saffron)]" />
                  Your Contact Information
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Official civic bodies require a verified phone number to follow up on your complaints.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="e.g. Anita Sharma"
                  error={errors.name?.message}
                  {...register("name")}
                />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700">
                    <span>{user.email}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  </div>
                </div>

                <div>
                  <Input
                    label="10-Digit Mobile Number"
                    type="tel"
                    placeholder="9876543210"
                    hint="Enter your 10-digit mobile number for status alerts and desk follow-ups."
                    error={errors.phone?.message}
                    {...register("phone")}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button type="button" className="w-full py-3" onClick={goToStep2}>
                  Continue to Address
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Address & PIN */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-[var(--navy)] flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[var(--saffron)]" />
                  Residential Address & Jurisdiction
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Type your 6-digit PIN code to automatically find your state, city, and nearest civic authorities.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="House / Flat / Street Address"
                  placeholder="e.g. 14, Barakhamba Road, Block C"
                  error={errors.address?.line1?.message}
                  {...register("address.line1")}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="PIN Code (6 digits)"
                    placeholder="e.g. 110001"
                    maxLength={6}
                    error={errors.address?.pincode?.message}
                    {...register("address.pincode", {
                      onChange: (e) => handlePincode(e.target.value),
                    })}
                  />

                  <Input
                    label="Locality / Area"
                    placeholder="e.g. Connaught Place"
                    error={errors.address?.area?.message}
                    {...register("address.area")}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
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
                    <Select
                      label="City"
                      error={errors.address?.city?.message}
                      {...register("address.city")}
                    >
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
                      placeholder="e.g. New Delhi"
                      error={errors.address?.city?.message}
                      {...register("address.city")}
                    />
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="button" className="flex-1 py-3" onClick={goToStep3}>
                  Preview Matched Desks
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-[var(--navy)] flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[var(--saffron)]" />
                  Review Your Civic Desks
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Based on your address, these official desks are assigned to receive and resolve your civic reports.
                </p>
              </div>

              <div className="rounded-2xl bg-[#f7efe3] p-4 text-sm text-[var(--navy)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{watch("name")}</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Phone: +91 {watch("phone")} · {formatAddress(watchedAddress)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs font-bold text-[var(--saffron)] hover:underline"
                  >
                    Edit
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Assigned Civic Authorities ({matchedBodies.length})
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {matchedBodies.map((match, idx) => (
                    <CivicBodyCard key={match.body.id} match={match} highlight={idx === 0} />
                  ))}
                </div>
              </div>

              {serverError && <p className="text-sm font-semibold text-red-600">{serverError}</p>}

              <div className="flex flex-wrap gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 py-3 text-base">
                  {isSubmitting ? "Saving profile..." : "Save & Finish Setup"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </Container>
    </section>
  );
}
