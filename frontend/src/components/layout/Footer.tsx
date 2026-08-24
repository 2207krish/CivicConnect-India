import { Mail, Phone, Wrench } from "lucide-react";
import Link from "next/link";

import Container from "./Container";
import Logo from "./Logo";
import { civicImages } from "@/config/media";
import { siteConfig } from "@/config/site";

const footerLinks = [
  { title: "Register", href: "/register" },
  { title: "Download Android app", href: "/download" },
  { title: "File a complaint", href: "/complaints/new" },
  { title: "Track complaint", href: "/track" },
  { title: "Civic bodies", href: "/civic-bodies" },
  { title: "Contact & feedback", href: "/contact" },
];

export default function Footer() {
  const { developer } = siteConfig;

  return (
    <footer id="contact" className="relative overflow-hidden bg-[var(--navy)] text-slate-200">
      <img
        src={civicImages.mumbai}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-15"
      />
      <div className="absolute inset-0 bg-[var(--navy)]/85" />
      <Container className="relative grid gap-10 py-16 md:grid-cols-3">
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
            CivicConnect India helps citizens register civic issues, reach the
            nearest municipal, electricity or water desk, and track the complaint
            until it is closed.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-300">
            Citizen services
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-amber-200">
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-300">
            Development & support
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            For development changes, modifications or bugs, contact{" "}
            <strong className="text-white">{developer.name}</strong>.
          </p>
          <p className="mt-4 flex items-center gap-2 text-sm">
            <Wrench className="h-4 w-4 text-amber-300" />
            Developer: {developer.name}
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-amber-300" />
            <a href={`mailto:${developer.email}`} className="hover:text-amber-200">
              {developer.email}
            </a>
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-amber-300" />
            <a href={`tel:${developer.phone}`} className="hover:text-amber-200">
              {developer.phoneDisplay}
            </a>
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-flex text-sm font-semibold text-amber-300 hover:text-amber-200"
          >
            Send feedback →
          </Link>
          <p className="mt-4">
            <a
              href={siteConfig.apkHref}
              className="text-sm font-semibold text-amber-300 hover:text-amber-200"
            >
              Download Android APK →
            </a>
          </p>
        </div>
      </Container>

      <div className="relative border-t border-white/10">
        <Container className="py-4 text-xs text-slate-400">
          © {new Date().getFullYear()} CivicConnect India. Built for citizen grievance routing.
        </Container>
      </div>
    </footer>
  );
}
