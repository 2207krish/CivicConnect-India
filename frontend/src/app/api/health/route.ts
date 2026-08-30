import { access, constants, mkdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const dataDir = path.join(process.cwd(), ".data");
const startedAt = Date.now();

export async function GET() {
  const checks: Record<string, string> = {};

  // 1. Data directory writable
  try {
    await mkdir(dataDir, { recursive: true });
    await access(dataDir, constants.W_OK);
    checks.dataDir = "writable";
  } catch {
    checks.dataDir = "NOT_WRITABLE";
  }

  // 2. Resend configured
  checks.resend = process.env.RESEND_API_KEY?.trim() ? "configured" : "missing";

  // 3. Google OAuth configured
  checks.googleOAuth = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim()
    ? "configured"
    : "missing";

  const healthy =
    checks.dataDir === "writable";

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      uptime: Math.floor((Date.now() - startedAt) / 1000),
      checks,
    },
    { status: healthy ? 200 : 503 }
  );
}
