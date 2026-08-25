import { Smartphone, Mail, ShieldCheck, Radio } from "lucide-react";
import Link from "next/link";

import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import { civicImages } from "@/config/media";
import { siteConfig } from "@/config/site";
import ServerHint from "./ServerHint";
import AdSlot from "@/components/ads/AdSlot";

const points = [
  {
    icon: Radio,
    title: "Live civic access",
    text: "The app uses the same CivicConnect server as this website. Complaints and tracking IDs stay in sync.",
  },
  {
    icon: Mail,
    title: "Email token verification",
    text: "Register with your real email. A 6-digit token is sent to your inbox. The app stays locked until you verify it.",
  },
  {
    icon: ShieldCheck,
    title: "Same citizen account",
    text: "Sign in with the account you create here. File a complaint on the phone and track it on the web, or the other way around.",
  },
];

export default function DownloadPage() {
  return (
    <section className="relative overflow-hidden">
      <img
        src={civicImages.night}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#f7f3ea] via-[#f7f3ea]/95 to-[#f7f3ea]" />

      <Container className="relative grid items-center gap-12 py-20 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--saffron)]">
            Android app
          </p>
          <h1 className="font-display mt-4 text-5xl text-[var(--navy)]">
            Take CivicConnect with you.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Download the official Android app for live civic routing, email
            token verification, and real-time complaint tracking — the same
            features as this portal.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href={siteConfig.apkHref}>
              <Smartphone className="mr-2 h-4 w-4" />
              Download APK
            </Button>
            <Button variant="outline" href="/register">
              Register on the web first
            </Button>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Android 8.0 and above. If Chrome warns that the file is uncommon,
            choose Download anyway, then allow install from this browser.
          </p>
          <ServerHint />
        </div>

        <div className="space-y-5">
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="rounded-[28px] border border-[#e5dccb] bg-white p-6 shadow-[0_16px_40px_rgba(20,32,51,0.06)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7efe3]">
                  <Icon className="h-6 w-6 text-[var(--saffron)]" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-[var(--navy)]">{point.title}</h2>
                <p className="mt-2 text-slate-600">{point.text}</p>
              </div>
            );
          })}
        </div>
      </Container>

      <Container className="relative pb-20">
        <div className="rounded-[32px] bg-[var(--navy)] px-8 py-10 text-white md:px-12">
          <h2 className="font-display text-3xl">How to install</h2>
          <ol className="mt-6 grid gap-4 text-sm leading-7 text-slate-200 md:grid-cols-3">
            <li>
              <span className="font-semibold text-amber-200">1. Download</span>
              <br />
              Tap Download APK on this page. The file is civicconnect-india.apk.
            </li>
            <li>
              <span className="font-semibold text-amber-200">2. Install</span>
              <br />
              Open the file, allow installs from the browser if asked, then tap Install.
            </li>
            <li>
              <span className="font-semibold text-amber-200">3. Verify email</span>
              <br />
              Register or sign in. Enter the 6-digit token from your email to unlock live access.
            </li>
          </ol>
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          Installing the app means you agree to the{" "}
          <Link href="/terms" className="font-semibold text-[var(--saffron)]">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-semibold text-[var(--saffron)]">
            Privacy Policy
          </Link>
          .
        </p>
        <AdSlot slotKey="download" />
      </Container>
    </section>
  );
}
