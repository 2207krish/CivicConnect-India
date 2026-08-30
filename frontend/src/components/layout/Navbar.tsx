"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  Layers,
  Info,
  Building2,
  BookOpen,
  Tag,
  Zap,
  HelpCircle,
  Cpu,
  LogOut,
} from "lucide-react";

import Container from "./Container";
import Logo from "./Logo";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { isProfileComplete } from "@/lib/user-utils";

/* ── Dropdown data ──────────────────────────────────────────── */

const exploreLinks = [
  {
    href: "/categories",
    label: "Complaint Categories",
    desc: "Browse all 10 issue types",
    Icon: Tag,
  },
  {
    href: "/civic-bodies",
    label: "Civic Bodies",
    desc: "Municipal, electricity & water desks",
    Icon: Building2,
  },
  {
    href: "/learn",
    label: "Civic Guide",
    desc: "Rights, budgets & escalation",
    Icon: BookOpen,
  },
];

const infoLinks = [
  {
    href: "/how-it-works",
    label: "How It Works",
    desc: "Four steps from address to desk",
    Icon: Layers,
  },
  {
    href: "/features",
    label: "Features",
    desc: "Why choose CivicConnect?",
    Icon: Zap,
  },
  {
    href: "/faq",
    label: "FAQ",
    desc: "Common questions answered",
    Icon: HelpCircle,
  },
];

/* ── Dropdown component ─────────────────────────────────────── */

function NavDropdown({
  label,
  items,
  icon: Icon,
}: {
  label: string;
  items: typeof exploreLinks;
  icon: typeof Info;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-[var(--saffron)]"
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-[#e5dccb] bg-white shadow-[0_20px_60px_rgba(20,32,51,0.12)]">
          <div className="p-2">
            {items.map(({ href, label: itemLabel, desc, Icon: ItemIcon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-[#f7f3ea]"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f7efe3]">
                  <ItemIcon className="h-4 w-4 text-[var(--saffron)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--navy)] group-hover:text-[var(--saffron)]">
                    {itemLabel}
                  </p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Navbar ────────────────────────────────────────────── */

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExplore, setMobileExplore] = useState(false);
  const [mobileInfo, setMobileInfo] = useState(false);
  const pathname = usePathname();

  // close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileExplore(false);
    setMobileInfo(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e5dccb]/80 bg-[rgba(247,243,234,0.92)] backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-[var(--saffron)]"
          >
            Home
          </Link>

          <NavDropdown label="Explore" items={exploreLinks} icon={Layers} />
          <NavDropdown label="About" items={infoLinks} icon={Info} />

          <Link
            href="/track"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-[var(--saffron)]"
          >
            Track complaint
          </Link>
        </nav>

        {/* Desktop auth actions */}
        <div className="hidden items-center gap-2.5 lg:flex">
          {user ? (
            <>
              {!isProfileComplete(user) ? (
                <Button href="/onboarding" className="text-sm">
                  Complete setup
                </Button>
              ) : (
                <>
                  <Button variant="outline" href="/dashboard" className="text-sm">
                    Dashboard
                  </Button>
                  <Button href="/complaints/new" className="text-sm">
                    Report issue
                  </Button>
                </>
              )}
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 rounded-full border border-red-200/80 bg-red-50/70 px-3.5 py-1.5 text-xs font-semibold text-red-600 transition-all hover:bg-red-100 hover:border-red-300 hover:shadow-sm ml-1"
                title="Log out of your account"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Button variant="outline" href="/download" className="text-sm">
                Get the app
              </Button>
              <Button variant="outline" href="/login" className="text-sm">
                Login
              </Button>
              <Button href="/register" className="text-sm">
                Register
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="rounded-full border border-[#d7cbb6] bg-white p-2 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5 text-[var(--navy)]" />
          ) : (
            <Menu className="h-5 w-5 text-[var(--navy)]" />
          )}
        </button>
      </Container>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-[#e5dccb] bg-[#fffaf2] lg:hidden">
          <Container className="py-4">
            {/* Static links */}
            <div className="space-y-1">
              <Link
                href="/"
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#f7f3ea] hover:text-[var(--saffron)]"
              >
                Home
              </Link>
              <Link
                href="/track"
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#f7f3ea] hover:text-[var(--saffron)]"
              >
                Track complaint
              </Link>
            </div>

            <div className="my-3 border-t border-[#e5dccb]" />

            {/* Explore accordion */}
            <button
              type="button"
              onClick={() => setMobileExplore((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--navy)]"
            >
              Explore
              <ChevronDown
                className={`h-4 w-4 transition-transform ${mobileExplore ? "rotate-180" : ""}`}
              />
            </button>
            {mobileExplore && (
              <div className="ml-3 mt-1 space-y-1">
                {exploreLinks.map(({ href, label, Icon: ItemIcon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-[#f7f3ea] hover:text-[var(--saffron)]"
                  >
                    <ItemIcon className="h-4 w-4 text-[var(--saffron)]" />
                    {label}
                  </Link>
                ))}
              </div>
            )}

            {/* About accordion */}
            <button
              type="button"
              onClick={() => setMobileInfo((v) => !v)}
              className="mt-1 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--navy)]"
            >
              About
              <ChevronDown
                className={`h-4 w-4 transition-transform ${mobileInfo ? "rotate-180" : ""}`}
              />
            </button>
            {mobileInfo && (
              <div className="ml-3 mt-1 space-y-1">
                {infoLinks.map(({ href, label, Icon: ItemIcon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-[#f7f3ea] hover:text-[var(--saffron)]"
                  >
                    <ItemIcon className="h-4 w-4 text-[var(--saffron)]" />
                    {label}
                  </Link>
                ))}
              </div>
            )}

            <div className="my-3 border-t border-[#e5dccb]" />

            {/* Auth actions */}
            <div className="flex flex-col gap-2">
              {user ? (
                <>
                  {!isProfileComplete(user) ? (
                    <Button href="/onboarding">Complete setup</Button>
                  ) : (
                    <>
                      <Button href="/complaints/new">Report an issue</Button>
                      <Button variant="outline" href="/dashboard">
                        Dashboard
                      </Button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={logout}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/80 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-100 hover:border-red-300"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Button href="/register">Create account</Button>
                  <Button variant="outline" href="/login">
                    Login
                  </Button>
                  <Button variant="outline" href="/download">
                    Get the Android app
                  </Button>
                </>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
