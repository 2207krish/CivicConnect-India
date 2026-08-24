import { adsenseConfig, adsenseReady } from "@/config/adsense";

export function GET() {
  const body = adsenseReady()
    ? `google.com, ${adsenseConfig.client.replace("ca-pub-", "pub-")}, DIRECT, f08c47fec0942fa0\n`
    : "# Add NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX to frontend/.env.local\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
