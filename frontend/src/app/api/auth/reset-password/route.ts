import { NextResponse } from "next/server";
import { resetPasswordSchema } from "@/lib/validators";
import { consumePasswordReset } from "@/lib/server/password-reset";
import { setSessionCookie } from "@/lib/server/cookies";
import { createSession } from "@/lib/server/sessions";
import { publicError } from "@/lib/server/public-error";
import { findUserByEmail, updateUserPassword } from "@/lib/server/users";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = resetPasswordSchema.parse(await request.json());
    await consumePasswordReset({
      email: body.email,
      otp: body.otp,
      token: body.token,
    });
    const user = await updateUserPassword(body.email, body.password);
    const stored = await findUserByEmail(body.email);
    const token = stored ? await createSession(stored.id) : null;
    if (token) await setSessionCookie(token);
    return NextResponse.json({ ok: true, user, sessionToken: token });
  } catch (error) {
    return NextResponse.json(
      { error: publicError(error, "Password reset failed.") },
      { status: 400 }
    );
  }
}
