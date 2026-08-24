import { NextResponse } from "next/server";
import { complaintSchema } from "@/lib/validators";
import { createServerComplaint, listUserComplaints } from "@/lib/server/complaints";
import { getCurrentUser } from "@/lib/server/current-user";
import { publicError } from "@/lib/server/public-error";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "You need to sign in first." }, { status: 401 });
  }
  const complaints = await listUserComplaints(user.id);
  return NextResponse.json({ complaints });
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "You need to sign in first." }, { status: 401 });
    }
    const body = complaintSchema.parse(await request.json());
    const address = body.useRegisteredAddress ? user.address : body.address;
    const result = await createServerComplaint({
      user,
      categoryId: body.categoryId,
      title: body.title,
      description: body.description,
      landmark: body.landmark,
      address,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { error: publicError(error, "Complaint could not be filed.") },
      { status: 400 }
    );
  }
}
