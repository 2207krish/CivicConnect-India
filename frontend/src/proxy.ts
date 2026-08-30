import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function httpsEnabled() {
  return process.env.FORCE_HTTPS === "true";
}

export function proxy(request: NextRequest) {
  if (!httpsEnabled()) {
    return NextResponse.next();
  }

  const proto = request.headers.get("x-forwarded-proto");
  const host = request.headers.get("host") || request.nextUrl.host;

  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    return NextResponse.next();
  }

  if (proto === "http") {
    const redirect = new URL(request.url);
    redirect.protocol = "https:";
    redirect.host = host;
    return NextResponse.redirect(redirect, 308);
  }

  const response = NextResponse.next();
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
