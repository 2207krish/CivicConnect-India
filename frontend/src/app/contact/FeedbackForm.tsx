"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";

const schema = z.object({
  name: z.string().min(3, "Enter your name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string(),
  topic: z.enum(["bug", "modification", "development", "other"]),
  message: z.string().min(12, "Please describe the issue or change in more detail"),
});

type Values = z.infer<typeof schema>;

export default function FeedbackForm() {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      topic: "bug",
      message: "",
    },
  });

  async function onSubmit(values: Values) {
    setError("");
    setStatus("");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) {
        throw new Error(data.error || "Could not send feedback.");
      }
      setStatus(data.message || "Thank you. Your feedback has been sent.");
      reset();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not send feedback.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-[28px] border border-[#e5dccb] bg-white p-6 shadow-[0_20px_50px_rgba(20,32,51,0.08)]"
    >
      <Input label="Your name" error={errors.name?.message} {...register("name")} />
      <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
      <Input
        label="Mobile number (optional)"
        inputMode="numeric"
        maxLength={10}
        error={errors.phone?.message}
        {...register("phone")}
      />
      <Select label="This is about" error={errors.topic?.message} {...register("topic")}>
        <option value="bug">Bug / something is broken</option>
        <option value="modification">Modification request</option>
        <option value="development">Development change</option>
        <option value="other">Other feedback</option>
      </Select>
      <Textarea
        label="Message"
        placeholder="Describe the bug, change or idea..."
        error={errors.message?.message}
        {...register("message")}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {status ? <p className="text-sm text-emerald-700">{status}</p> : null}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send feedback"}
      </Button>
    </form>
  );
}
