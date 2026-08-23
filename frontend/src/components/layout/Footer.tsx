import Link from "next/link";
import Container from "./Container";
import Logo from "./Logo";
import { civicImages } from "@/config/media";

const footerLinks = [
  { title: "Register", href: "/register" },
  { title: "File a complaint", href: "/complaints/new" },
  { title: "Track complaint", href: "/track" },
  { title: "Civic bodies", href: "/civic-bodies" },
];

export default function Footer() {
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
            Helpdesk
          </h3>
          <p className="mt-4 text-sm">For portal support: support@civicconnect.in</p>
          <p className="mt-2 text-sm">Helpline: 1800-123-2450</p>
          <p className="mt-2 text-sm">Working hours: Mon–Sat, 10:00 AM – 6:00 PM</p>
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
