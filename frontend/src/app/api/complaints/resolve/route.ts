import { NextResponse } from "next/server";
import { resolveServerComplaint } from "@/lib/server/complaints";
import { getCurrentUser } from "@/lib/server/current-user";
import { publicError } from "@/lib/server/public-error";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "You need to sign in first." }, { status: 401 });
    }
    const body = (await request.json()) as { id?: string };
    if (!body.id) {
      return NextResponse.json({ error: "Complaint id is required." }, { status: 400 });
    }
    const complaint = await resolveServerComplaint(body.id, user.id);
    return NextResponse.json({ ok: true, complaint });
  } catch (error) {
    return NextResponse.json(
      { error: publicError(error, "Could not update this complaint.") },
      { status: 400 }
    );
  }
}
