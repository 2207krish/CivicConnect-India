import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { setSessionCookie } from "@/lib/server/cookies";
import { createSession } from "@/lib/server/sessions";
import {
  createOAuthUser,
  findUserByEmail,
  findUserByGoogleId,
  linkGoogleAccount,
} from "@/lib/server/users";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export async function POST(request: Request) {
  try {
    const { idToken } = (await request.json()) as { idToken?: string };

    if (!idToken) {
      return NextResponse.json({ error: "Missing ID token." }, { status: 400 });
    }

    if (!CLIENT_ID) {
      return NextResponse.json(
        { error: "Google OAuth is not configured on this server." },
        { status: 500 }
      );
    }

    // Verify the ID token with Google
    const client = new OAuth2Client(CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
      return NextResponse.json(
        { error: "Invalid Google token payload." },
        { status: 400 }
      );
    }

    const { sub: googleId, email, name, picture } = payload;
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if a user with this googleId already exists
    let user = await findUserByGoogleId(googleId);

    if (!user) {
      // 2. Check if an account with this email already exists (email+password user)
      const existingByEmail = await findUserByEmail(normalizedEmail);

      if (existingByEmail) {
        // Link the Google account to the existing email+password account
        user = await linkGoogleAccount(
          existingByEmail.id,
          googleId,
          picture ?? undefined
        );
      } else {
        // 3. Brand new user — create a pre-verified OAuth account
        user = await createOAuthUser({
          name: name || normalizedEmail.split("@")[0],
          email: normalizedEmail,
          googleId,
          picture: picture ?? undefined,
        });
      }
    }

    // Create session
    const token = await createSession(user.id);
    await setSessionCookie(token);

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Google sign-in failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
