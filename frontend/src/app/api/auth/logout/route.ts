import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/server/cookies";
import { getRequestSessionToken } from "@/lib/server/current-user";
import { deleteSession } from "@/lib/server/sessions";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const token = await getRequestSessionToken(request);
  await deleteSession(token);
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
