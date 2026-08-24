import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/validators";
import { issuePasswordReset } from "@/lib/server/password-reset";
import { publicError } from "@/lib/server/public-error";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = forgotPasswordSchema.parse(await request.json());
    await issuePasswordReset(body.email, request);
    return NextResponse.json({
      ok: true,
      email: body.email.trim().toLowerCase(),
      message: "If an account exists for this email, a reset token has been sent.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: publicError(error, "Could not send the reset token.") },
      { status: 400 }
    );
  }
}
