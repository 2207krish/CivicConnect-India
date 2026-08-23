import { NextResponse } from "next/server";
import { clearSessionCookie, getSessionToken } from "@/lib/server/cookies";
import { deleteSession } from "@/lib/server/sessions";

export const runtime = "nodejs";

export async function POST() {
  const token = await getSessionToken();
  await deleteSession(token);
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
