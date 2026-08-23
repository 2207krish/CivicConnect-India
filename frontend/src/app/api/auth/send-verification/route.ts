import { NextResponse } from "next/server";
import { sendVerificationSchema } from "@/lib/validators";
import { clientIp, issueVerificationEmail } from "@/lib/server/verification";
import { publicError } from "@/lib/server/public-error";
import { findUserByEmail } from "@/lib/server/users";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = sendVerificationSchema.parse(await request.json());
    const stored = await findUserByEmail(body.email);
    if (!stored) {
      return NextResponse.json(
        { error: "No registration was found for this email." },
        { status: 404 }
      );
    }
    if (stored.emailVerified) {
      return NextResponse.json(
        { error: "This email is already verified. You can log in." },
        { status: 400 }
      );
    }

    const delivery = await issueVerificationEmail(
      stored.email,
      body.name || stored.name,
      request,
      clientIp(request)
    );

    return NextResponse.json({
      ok: true,
      email: stored.email,
      previewUrl: delivery.previewUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { error: publicError(error, "Could not send the verification token.") },
      { status: 400 }
    );
  }
}
