import { NextResponse } from "next/server";
import { profileSchema } from "@/lib/validators";
import { getCurrentUser } from "@/lib/server/current-user";
import { assignHomeCivicBodies } from "@/lib/matching";
import { publicError } from "@/lib/server/public-error";
import { updateUserProfile } from "@/lib/server/users";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return PATCH(request);
}

export async function PATCH(request: Request) {
  try {
    const current = await getCurrentUser(request);
    if (!current) {
      return NextResponse.json({ error: "You need to sign in first." }, { status: 401 });
    }

    const body = profileSchema.parse(await request.json());
    const user = await updateUserProfile(current.id, {
      name: body.name,
      phone: body.phone,
      address: body.address,
      nearestBodyIds: assignHomeCivicBodies(body.address).map((item) => item.body.id),
    });
    return NextResponse.json({ ok: true, user });
  } catch (error) {
    return NextResponse.json(
      { error: publicError(error, "Profile update failed.") },
      { status: 400 }
    );
  }
}
