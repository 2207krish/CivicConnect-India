import { Smartphone } from "lucide-react";

import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import { civicImages } from "@/config/media";
import { siteConfig } from "@/config/site";

export default function AndroidApp() {
  return (
    <section className="relative overflow-hidden py-20">
      <Container className="relative overflow-hidden rounded-[32px] bg-[var(--navy)] px-8 py-12 text-white md:px-12">
        <img
          src={civicImages.night}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">
              Android app
            </p>
            <h2 className="font-display mt-3 text-4xl">Take CivicConnect with you</h2>
            <p className="mt-4 max-w-xl text-slate-200 leading-7">
              Install the official Android app to register, verify your email,
              file complaints, track them, reset your password, and send
              feedback — the same account as this website.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href={siteConfig.apkHref}>
                <Smartphone className="mr-2 h-4 w-4" />
                Download APK
              </Button>
              <Button
                variant="outline"
                href="/download"
                className="border-white/30 bg-white/10 text-white hover:border-amber-300 hover:text-amber-200"
              >
                Install instructions
              </Button>
            </div>
          </div>
          <div className="rounded-[24px] border border-white/15 bg-white/10 p-6 text-sm leading-7 text-slate-100">
            <p>
              File: <strong>civicconnect-india.apk</strong>
            </p>
            <p className="mt-2">Android 8.0 and above. Allow installs from this browser if asked.</p>
            <p className="mt-2">
              Direct link:{" "}
              <a href={siteConfig.apkHref} className="font-semibold text-amber-200 hover:text-amber-100">
                {siteConfig.apkHref}
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
