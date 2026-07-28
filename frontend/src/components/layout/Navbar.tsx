import Link from "next/link";

import Logo from "./Logo";
import Container from "./Container";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">

        <Logo />

        <nav className="hidden gap-8 md:flex">

          <Link href="/">Home</Link>

          <Link href="/features">Features</Link>

          <Link href="/categories">Categories</Link>

          <Link href="/faq">FAQ</Link>

          <Link href="/contact">Contact</Link>

        </nav>

        <div className="flex items-center gap-3">

          <Button variant="ghost">
            Login
          </Button>

          <Button>
            Report Complaint
          </Button>

        </div>

      </Container>
    </header>
  );
}