import { NextResponse } from "next/server";
import { registerApiSchema } from "@/lib/validators";
import { publicError } from "@/lib/server/public-error";
import { clientIp, issueVerificationEmail } from "@/lib/server/verification";
import { createUnverifiedUser, findUserByEmail } from "@/lib/server/users";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = registerApiSchema.parse(await request.json());
    const existing = await findUserByEmail(body.email);

    if (existing?.emailVerified) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    if (!existing) {
      await createUnverifiedUser(body);
    }

    const delivery = await issueVerificationEmail(
      body.email,
      existing?.name || body.name,
      request,
      clientIp(request)
    );

    return NextResponse.json({
      ok: true,
      needsVerification: true,
      email: body.email.trim().toLowerCase(),
      previewUrl: delivery.previewUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { error: publicError(error, "Registration could not be completed.") },
      { status: 400 }
    );
  }
}
