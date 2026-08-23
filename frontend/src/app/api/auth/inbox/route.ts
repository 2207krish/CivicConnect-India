import { NextResponse } from "next/server";
import { getOutboxMessage } from "@/lib/server/outbox";
import { findUserByEmail } from "@/lib/server/users";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get("email")?.trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const user = await findUserByEmail(email);
  if (!user || user.emailVerified) {
    return NextResponse.json({ message: null });
  }

  const message = await getOutboxMessage(email);
  if (!message) {
    return NextResponse.json({ message: null });
  }

  return NextResponse.json({
    message: {
      to: message.to,
      subject: message.subject,
      text: message.text,
      otp: message.delivery === "preview" ? message.otp : null,
      verifyUrl: message.delivery === "preview" ? message.verifyUrl : null,
      previewUrl: message.previewUrl,
      sentAt: message.sentAt,
      delivery: message.delivery,
    },
  });
}
