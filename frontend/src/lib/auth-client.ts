import type { Address, PublicUser } from "@/types";

class AuthApiError extends Error {
  code?: string;
  email?: string;
  previewUrl?: string | null;

  constructor(
    message: string,
    extras?: { code?: string; email?: string; previewUrl?: string | null }
  ) {
    super(message);
    this.code = extras?.code;
    this.email = extras?.email;
    this.previewUrl = extras?.previewUrl;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => ({}))) as T & {
    error?: string;
    code?: string;
    email?: string;
    previewUrl?: string | null;
  };

  if (!response.ok) {
    throw new AuthApiError(data.error || "Request failed.", {
      code: data.code,
      email: data.email,
      previewUrl: data.previewUrl,
    });
  }

  return data;
}

export async function apiRegister(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: Address;
}) {
  return parseResponse<{
    ok: true;
    needsVerification: true;
    email: string;
    previewUrl: string | null;
  }>(
    await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
  );
}

export async function apiLogin(email: string, password: string) {
  return parseResponse<{ ok: true; user: PublicUser }>(
    await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
  );
}

export async function apiLogout() {
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function apiMe() {
  const data = await parseResponse<{ user: PublicUser | null }>(
    await fetch("/api/auth/me")
  );
  return data.user;
}

export async function apiVerifyEmail(input: {
  email: string;
  otp?: string;
  token?: string;
}) {
  return parseResponse<{ ok: true; user: PublicUser }>(
    await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
  );
}

export async function apiSendVerification(email: string, name?: string) {
  return parseResponse<{
    ok: true;
    email: string;
    delivery?: "smtp" | "preview";
    previewUrl: string | null;
  }>(
    await fetch("/api/auth/send-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    })
  );
}

export async function apiVerificationInbox(email: string) {
  return parseResponse<{
    message: {
      to: string;
      subject: string;
      text: string;
      otp: string | null;
      verifyUrl: string | null;
      previewUrl: string | null;
      sentAt: string;
      delivery: "preview" | "smtp";
    } | null;
  }>(await fetch(`/api/auth/inbox?email=${encodeURIComponent(email)}`));
}

export async function apiForgotPassword(email: string) {
  return parseResponse<{ ok: true; email: string; message: string }>(
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
  );
}

export async function apiResetPassword(input: {
  email: string;
  otp?: string;
  token?: string;
  password: string;
  confirmPassword: string;
}) {
  return parseResponse<{ ok: true; user: PublicUser; sessionToken?: string | null }>(
    await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
  );
}

export async function apiUpdateProfile(input: {
  name: string;
  phone: string;
  address: Address;
}) {
  return parseResponse<{ ok: true; user: PublicUser }>(
    await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
  );
}

export { AuthApiError };
