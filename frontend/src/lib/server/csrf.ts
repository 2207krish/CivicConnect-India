import { cookies } from "next/headers";
import { randomBytes } from "crypto";

const CSRF_COOKIE = "cc_csrf";
const CSRF_HEADER = "x-csrf-token";
const TOKEN_BYTES = 32;

/**
 * Issue a CSRF token — sets an HTTP-only cookie and returns
 * the token so the client can include it in headers / forms.
 */
export async function issueCsrfToken(): Promise<string> {
  const token = randomBytes(TOKEN_BYTES).toString("hex");
  const jar = await cookies();
  jar.set({
    name: CSRF_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "strict",
    secure:
      process.env.FORCE_HTTPS === "true" ||
      Boolean(process.env.APP_URL?.startsWith("https://")) ||
      process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });
  return token;
}

/**
 * Validate the CSRF token sent in the `x-csrf-token` header
 * against the cookie value. Throws on mismatch.
 */
export async function validateCsrf(request: Request): Promise<void> {
  const jar = await cookies();
  const cookieToken = jar.get(CSRF_COOKIE)?.value;
  const headerToken = request.headers.get(CSRF_HEADER);

  if (!cookieToken || !headerToken) {
    throw new CsrfError("Missing CSRF token.");
  }

  if (cookieToken !== headerToken) {
    throw new CsrfError("Invalid CSRF token.");
  }
}

export class CsrfError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CsrfError";
  }
}
