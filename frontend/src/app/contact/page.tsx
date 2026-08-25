import { Mail, Phone, Wrench } from "lucide-react";
import Link from "next/link";

import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import { civicImages } from "@/config/media";
import { siteConfig } from "@/config/site";
import AdSlot from "@/components/ads/AdSlot";
import FeedbackForm from "./FeedbackForm";

export default function ContactPage() {
  const { developer } = siteConfig;

  return (
    <section className="relative overflow-hidden">
      <img
        src={civicImages.city}
        alt=""
        className="absolute inset-0 h-40 w-full object-cover opacity-30"
      />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[rgba(11,27,51,0.55)] to-[#f7f3ea]" />

      <Container className="relative grid gap-10 py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--saffron)]">
            Contact
          </p>
          <h1 className="font-display mt-3 text-4xl text-[var(--navy)]">
            Development, modifications and bugs
          </h1>
          <p className="mt-4 max-w-xl text-slate-600 leading-7">
            For development changes, modifications or bugs in CivicConnect India,
            contact the developer below. You can also send feedback with the form.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            <Link href="/privacy" className="font-semibold text-[var(--saffron)]">
              Privacy Policy
            </Link>
            {" · "}
            <Link href="/terms" className="font-semibold text-[var(--saffron)]">
              Terms of Service
            </Link>
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-[28px] border border-[#e5dccb] bg-white p-6 shadow-[0_16px_40px_rgba(20,32,51,0.06)]">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--saffron)]">
                <Wrench className="h-4 w-4" />
                Developer
              </p>
              <p className="mt-3 text-2xl font-semibold text-[var(--navy)]">{developer.name}</p>
              <p className="mt-4 flex items-center gap-3 text-slate-700">
                <Mail className="h-4 w-4 text-[var(--saffron)]" />
                <a href={`mailto:${developer.email}`} className="hover:text-[var(--saffron)]">
                  {developer.email}
                </a>
              </p>
              <p className="mt-3 flex items-center gap-3 text-slate-700">
                <Phone className="h-4 w-4 text-[var(--saffron)]" />
                <a href={`tel:${developer.phone}`} className="hover:text-[var(--saffron)]">
                  {developer.phoneDisplay}
                </a>
              </p>
            </div>
            <div className="rounded-[28px] border border-[#e5dccb] bg-white p-6 shadow-[0_16px_40px_rgba(20,32,51,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--saffron)]">
                Android app
              </p>
              <p className="mt-3 text-slate-700 leading-7">
                The same contact details, forgot-password flow and feedback form
                are in the Android app.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button href={siteConfig.apkHref}>Download APK</Button>
                <Button variant="outline" href="/download">
                  Install help
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[var(--navy)]">Send feedback</h2>
          <p className="mt-2 mb-6 text-slate-600">
            Report a bug, request a modification, or share a development idea.
            Messages are sent to {developer.name}.
          </p>
          <FeedbackForm />
        </div>
      </Container>

      <Container className="pb-16">
        <AdSlot slotKey="contact" />
      </Container>
    </section>
  );
}
