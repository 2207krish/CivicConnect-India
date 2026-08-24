import { NextResponse } from "next/server";
import { z } from "zod";
import { saveFeedback } from "@/lib/server/feedback";
import { publicError } from "@/lib/server/public-error";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(3, "Enter your name"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .refine((value) => value === "" || /^[6-9]\d{9}$/.test(value), "Enter a valid 10-digit mobile number"),
  topic: z.enum(["bug", "modification", "development", "other"]),
  message: z.string().min(12, "Please describe the issue or change in more detail"),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const result = await saveFeedback({
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || undefined,
      topic: body.topic,
      message: body.message.trim(),
    });
    return NextResponse.json({
      ok: true,
      emailed: result.emailed,
      message: result.emailed
        ? "Thank you. Your feedback has been emailed to Sh K S Shekhawat."
        : "Thank you. Your feedback has been recorded for Sh K S Shekhawat.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: publicError(error, "Could not send feedback.") },
      { status: 400 }
    );
  }
}
