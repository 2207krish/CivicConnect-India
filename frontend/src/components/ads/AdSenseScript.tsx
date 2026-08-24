import Script from "next/script";
import { adsenseConfig, adsenseReady } from "@/config/adsense";

export default function AdSenseScript() {
  if (!adsenseReady()) return null;

  return (
    <Script
      id="adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseConfig.client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
