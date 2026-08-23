"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Protected from "@/components/auth/Protected";
import CivicBodyCard from "@/components/civic/CivicBodyCard";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { useAuth } from "@/context/AuthContext";
import { complaintCategories, getCategory } from "@/data/categories";
import { CITIES_BY_STATE, INDIAN_STATES, lookupPincode } from "@/data/locations";
import { findBestBodyForDepartment } from "@/lib/matching";
import { createComplaint } from "@/lib/storage";
import { complaintSchema, type ComplaintValues } from "@/lib/validators";
import type { ComplaintPhoto } from "@/types";

export default function NewComplaintPage() {
  return (
    <Suspense
      fallback={
        <section className="py-16">
          <Container className="text-sm text-slate-500">Loading complaint form...</Container>
        </section>
      }
    >
      <Protected>
        <NewComplaintForm />
      </Protected>
    </Suspense>
  );
}

function NewComplaintForm() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [photos, setPhotos] = useState<ComplaintPhoto[]>([]);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ComplaintValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      categoryId: searchParams.get("category") ?? "roads",
      title: "",
      description: "",
      landmark: "",
      useRegisteredAddress: true,
      address: user?.address,
    },
  });

  const categoryId = watch("categoryId");
  const useRegisteredAddress = watch("useRegisteredAddress");
  const liveAddress = useRegisteredAddress ? user?.address : watch("address");
  const selectedState = watch("address.state");
  const cities = CITIES_BY_STATE[selectedState] ?? [];

  const category = getCategory(categoryId);
  const match = useMemo(() => {
    if (!liveAddress || !category) return null;
    return findBestBodyForDepartment(liveAddress, category.department);
  }, [category, liveAddress]);

  async function onPhotos(files: FileList | null) {
    if (!files) return;
    const selected = Array.from(files).slice(0, 3);
    const next: ComplaintPhoto[] = [];

    for (const file of selected) {
      if (file.size > 2 * 1024 * 1024) {
        setFormError("Each photo must be under 2 MB.");
        return;
      }
      const dataUrl = await readFile(file);
      next.push({ name: file.name, dataUrl });
    }

    setPhotos(next);
    setFormError("");
  }

  async function onSubmit(values: ComplaintValues) {
    if (!user || !match) {
      setFormError("We could not find a civic body for this location yet.");
      return;
    }

    setFormError("");
    try {
      const { complaint } = createComplaint({
        user,
        categoryId: values.categoryId,
        title: values.title,
        description: values.description,
        landmark: values.landmark,
        photos,
        address: values.useRegisteredAddress ? user.address : values.address,
        civicBodyId: match.body.id,
      });
      router.push(`/complaints/${complaint.trackingId}`);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Could not file the complaint.");
    }
  }

  if (!user) return null;

  return (
    <section className="py-16">
      <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <h1 className="text-3xl font-bold">Register a civic complaint</h1>
          <p className="mt-3 text-slate-600">
            Describe the problem. We will prepare an official letter and email it
            to the civic body that covers this location and category.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <Select label="Category" error={errors.categoryId?.message} {...register("categoryId")}>
              {complaintCategories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </Select>
            <Input
              label="Short title"
              placeholder="Deep pothole near the bus stop"
              error={errors.title?.message}
              {...register("title")}
            />
            <Textarea
              label="Describe the problem"
              placeholder="When did it start, who is affected, and what needs to be fixed?"
              error={errors.description?.message}
              {...register("description")}
            />
            <Input
              label="Nearby landmark (optional)"
              placeholder="Opposite the post office"
              error={errors.landmark?.message}
              {...register("landmark")}
            />

            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input type="checkbox" {...register("useRegisteredAddress")} />
              Use my registered home address
            </label>

            {!useRegisteredAddress ? (
              <div className="grid gap-5 rounded-xl bg-slate-50 p-4">
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
                      const matchPincode = lookupPincode(event.target.value);
                      if (matchPincode) {
                        setValue("address.area", matchPincode.area);
                        setValue("address.city", matchPincode.city);
                        setValue("address.state", matchPincode.state);
                      }
                    },
                  })}
                />
                <Input label="Area" error={errors.address?.area?.message} {...register("address.area")} />
                <Select label="State" error={errors.address?.state?.message} {...register("address.state")}>
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
              </div>
            ) : null}

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Photos (optional, up to 3)</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => onPhotos(event.target.files)}
                className="block w-full text-sm text-slate-600"
              />
            </label>
            {photos.length > 0 ? (
              <div className="flex gap-3">
                {photos.map((photo) => (
                  <img
                    key={photo.name}
                    src={photo.dataUrl}
                    alt={photo.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                ))}
              </div>
            ) : null}

            {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
            <Button type="submit" disabled={isSubmitting || !match}>
              {isSubmitting ? "Sending complaint..." : "Email complaint to civic body"}
            </Button>
          </form>
        </div>

        <aside className="space-y-4">
          <h2 className="text-lg font-semibold">This complaint will go to</h2>
          {match ? (
            <CivicBodyCard match={match} highlight />
          ) : (
            <p className="text-sm text-slate-500">
              Add a complete address so we can locate the correct desk.
            </p>
          )}
        </aside>
      </Container>
    </section>
  );
}

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
