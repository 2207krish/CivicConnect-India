import Link from "next/link";

import Container from "./Container";
import Logo from "./Logo";

import Button from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="outline">
            Login
          </Button>

          <Button>
            Report Complaint
          </Button>
        </div>

        {/* Mobile Placeholder */}
        <div className="md:hidden">
          <Button>Menu</Button>
        </div>
      </Container>
    </header>
  );
}