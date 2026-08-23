import { NextResponse } from "next/server";
import { verifyEmailSchema } from "@/lib/validators";
import { setSessionCookie } from "@/lib/server/cookies";
import { createSession } from "@/lib/server/sessions";
import { consumeVerification } from "@/lib/server/verification";
import { publicError } from "@/lib/server/public-error";
import { asPublicUser, findUserByEmail, markUserEmailVerified } from "@/lib/server/users";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = verifyEmailSchema.parse(await request.json());
    const stored = await findUserByEmail(body.email);
    if (!stored) {
      return NextResponse.json(
        { error: "No registration was found for this email." },
        { status: 404 }
      );
    }

    if (!stored.emailVerified) {
      await consumeVerification(body);
    }

    const user = stored.emailVerified
      ? asPublicUser(stored)
      : await markUserEmailVerified(body.email);

    const token = await createSession(stored.id);
    await setSessionCookie(token);
    return NextResponse.json({ ok: true, user });
  } catch (error) {
    return NextResponse.json(
      { error: publicError(error, "Email verification failed.") },
      { status: 400 }
    );
  }
}
