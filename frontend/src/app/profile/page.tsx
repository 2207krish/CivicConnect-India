"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Protected from "@/components/auth/Protected";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useAuth } from "@/context/AuthContext";
import { CITIES_BY_STATE, INDIAN_STATES, lookupPincode } from "@/data/locations";
import { profileSchema, type ProfileValues } from "@/lib/validators";

export default function ProfilePage() {
  return (
    <Protected>
      <ProfileForm />
    </Protected>
  );
}

function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: user
      ? { name: user.name, phone: user.phone, address: user.address }
      : undefined,
  });

  const selectedState = watch("address.state");
  const cities = CITIES_BY_STATE[selectedState] ?? [];

  if (!user) return null;

  async function onSubmit(values: ProfileValues) {
    await updateProfile(values);
    setSaved(true);
  }

  return (
    <section className="py-16">
      <Container className="max-w-2xl">
        <h1 className="text-3xl font-bold">Your profile</h1>
        <p className="mt-3 text-slate-600">
          If you move house, update the address here. We will rematch the nearest
          civic bodies before your next complaint.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <Input label="Full name" error={errors.name?.message} {...register("name")} />
          <Input
            id="profile-email"
            label="Email ID"
            value={user.email}
            disabled
            hint="Email is used as your login ID and cannot be changed."
          />
          <Input label="Mobile number" error={errors.phone?.message} {...register("phone")} />
          <Input
            label="House / street address"
            error={errors.address?.line1?.message}
            {...register("address.line1")}
          />
          <Input
            label="PIN code"
            error={errors.address?.pincode?.message}
            {...register("address.pincode", {
              onChange: (event) => {
                const match = lookupPincode(event.target.value);
                if (match) {
                  setValue("address.area", match.area);
                  setValue("address.city", match.city);
                  setValue("address.state", match.state);
                }
              },
            })}
          />
          <Input label="Area" error={errors.address?.area?.message} {...register("address.area")} />
          <Select label="State / UT" error={errors.address?.state?.message} {...register("address.state")}>
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
            <Input label="City" error={errors.address?.city?.message} {...register("address.city")} />
          )}
          {saved ? (
            <p className="text-sm text-emerald-700">
              Profile updated. Your nearest civic bodies have been refreshed.
            </p>
          ) : null}
          <Button type="submit" disabled={isSubmitting}>
            Save changes
          </Button>
        </form>
      </Container>
    </section>
  );
}
