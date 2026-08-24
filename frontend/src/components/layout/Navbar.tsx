"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import Container from "./Container";
import Logo from "./Logo";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { siteConfig } from "@/config/site";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e5dccb]/80 bg-[rgba(247,243,234,0.86)] backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-7 md:flex">
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-[var(--saffron)]"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Button variant="outline" href="/download">
                Get the app
              </Button>
              <Button variant="outline" href="/dashboard">
                Dashboard
              </Button>
              <Button href="/complaints/new">Report complaint</Button>
              <button
                type="button"
                onClick={logout}
                className="text-sm font-medium text-slate-500 hover:text-[var(--navy)]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Button variant="outline" href="/download">
                Get the app
              </Button>
              <Button variant="outline" href="/login">
                Login
              </Button>
              <Button href="/register">Register</Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-full border border-[#d7cbb6] bg-white p-2 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      {open ? (
        <div className="border-t border-[#e5dccb] bg-[#fffaf2] md:hidden">
          <Container className="flex flex-col gap-3 py-4">
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-slate-700"
              >
                {item.title}
              </Link>
            ))}
            {user ? (
              <>
                <Button href="/download">Get the app</Button>
                <Button href="/dashboard">Dashboard</Button>
                <Button variant="outline" href="/complaints/new">
                  Report complaint
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="text-left text-sm text-slate-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Button href="/download">Get the app</Button>
                <Button href="/login">Login</Button>
                <Button variant="outline" href="/register">
                  Register
                </Button>
              </>
            )}
          </Container>
        </div>
      ) : null}
    </header>
  );
}
