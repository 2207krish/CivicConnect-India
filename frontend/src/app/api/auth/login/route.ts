import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validators";
import { verifyPassword, isLegacyHash, hashPassword, createSalt } from "@/lib/hash";
import { setSessionCookie } from "@/lib/server/cookies";
import { createSession } from "@/lib/server/sessions";
import { publicError } from "@/lib/server/public-error";
import { asPublicUser, findUserByEmail, rehashUserPassword } from "@/lib/server/users";
import { issueLoginOtp, verifyLoginOtp } from "@/lib/server/login-otp";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json());
    const stored = await findUserByEmail(body.email);
    if (!stored) {
      return NextResponse.json(
        { error: "No account found for this email." },
        { status: 401 }
      );
    }

    // OAuth-only accounts have no password — direct them to use Google sign-in
    if (!stored.salt || !stored.passwordHash) {
      return NextResponse.json(
        { error: "This account was created with Google. Please use 'Continue with Google' to sign in." },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(body.password, stored.salt, stored.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    if (!stored.emailVerified) {
      return NextResponse.json(
        {
          error: "Verify the token sent to your email before logging in.",
          code: "UNVERIFIED",
          email: stored.email,
        },
        { status: 403 }
      );
    }

    // If OTP is not provided, send OTP to user email and request verification
    if (!body.otp || body.otp.trim() === "") {
      await issueLoginOtp(stored.email, stored.name);
      return NextResponse.json({
        ok: true,
        requiresOtp: true,
        email: stored.email,
        message: `A 6-digit login OTP has been sent to ${stored.email}.`,
      });
    }

    // Verify the provided OTP
    await verifyLoginOtp(stored.email, body.otp);

    // Transparently upgrade legacy SHA-256 hashes to PBKDF2
    if (stored.passwordHash && isLegacyHash(stored.passwordHash)) {
      const newSalt = createSalt();
      const newHash = await hashPassword(body.password, newSalt);
      await rehashUserPassword(stored.id, newSalt, newHash).catch(() => {
        // Non-critical — log but don't block login
        console.warn("[auth] Failed to re-hash legacy password for", stored.email);
      });
    }

    const token = await createSession(stored.id);
    await setSessionCookie(token);
    return NextResponse.json({
      ok: true,
      user: asPublicUser(stored),
      sessionToken: token,
    });
  } catch (error) {
    return NextResponse.json(
      { error: publicError(error, "Login failed.") },
      { status: 400 }
    );
  }
}
