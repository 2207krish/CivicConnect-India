import { NextResponse } from "next/server";
import { findComplaintByTrackingId } from "@/lib/server/complaints";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id") ?? "";
  const { complaint, dispatch } = await findComplaintByTrackingId(id);
  if (!complaint) {
    return NextResponse.json({ error: "No complaint found for this ID." }, { status: 404 });
  }
  return NextResponse.json({ complaint, dispatch });
}
