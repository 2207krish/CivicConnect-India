import { type Metadata } from "next";
import { UserPlus, Building2, Mail, Search } from "lucide-react";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "How It Works — CivicConnect India",
  description:
    "Four simple steps: register, find your nearest civic body, file a complaint, and track it with your unique CivicConnect ID.",
};

const steps = [
  {
    icon: UserPlus,
    title: "Register and verify email",
    description:
      "Share your details, then enter the one-time token sent to your inbox. Your account activates in seconds.",
  },
  {
    icon: Building2,
    title: "See the nearest civic body",
    description:
      "We match municipal corporations, electricity DISCOMs, and water boards near your PIN code automatically.",
  },
  {
    icon: Mail,
    title: "Email the official desk",
    description:
      "Your complaint is sent directly to the civic body's registered email ID — no middlemen, no delays.",
  },
  {
    icon: Search,
    title: "Track the complaint",
    description:
      "Use your CivicConnect tracking ID any time to see acknowledgement and resolution progress.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-[var(--navy)] py-20 text-white">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
            Simple path
          </p>
          <h1 className="font-display mt-4 text-5xl leading-tight lg:text-6xl">
            How CivicConnect works
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            From your home address to the right civic desk, in four clear steps.
            No guesswork, no wrong departments.
          </p>
        </Container>
      </section>

      {/* Steps */}
      <section className="bg-[#efe7d8] py-24">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="rounded-3xl bg-white p-8 text-center shadow-[0_14px_36px_rgba(20,32,51,0.07)]"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f7efe3]">
                    <Icon className="h-8 w-8 text-[var(--saffron)]" />
                  </div>
                  <div className="mt-6 text-sm font-bold tracking-widest text-[var(--saffron)]">
                    STEP {index + 1}
                  </div>
                  <h2 className="font-display mt-3 text-2xl text-[var(--navy)]">
                    {step.title}
                  </h2>
                  <p className="mt-3 leading-7 text-slate-600">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Visual connector line for desktop */}
          <p className="mt-12 text-center text-sm text-slate-500">
            Each step builds on the last — register once and every future
            complaint is pre-filled with your details.
          </p>
        </Container>
      </section>

      {/* Detail section */}
      <section className="py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--saffron)]">
                Registration
              </p>
              <h2 className="font-display mt-3 text-4xl text-[var(--navy)]">
                One account, every desk
              </h2>
              <p className="mt-4 leading-8 text-slate-600">
                Create your citizen account with your name, email, mobile number,
                and residential address. A 6-digit verification token is sent to
                your inbox — enter it to activate. Once verified, your details
                pre-fill every complaint you file.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                {[
                  "Email token expires in 15 minutes and can be resent",
                  "Password reset by email — no support ticket needed",
                  "Same account works on the Android app",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f7efe3] text-[10px] font-bold text-[var(--saffron)]">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--saffron)]">
                Routing
              </p>
              <h2 className="font-display mt-3 text-4xl text-[var(--navy)]">
                Exact desk, not a general inbox
              </h2>
              <p className="mt-4 leading-8 text-slate-600">
                We match your city, state, and PIN code against municipal
                corporations, electricity DISCOMs, water boards, and traffic
                desks. Exact PIN matches rank highest. Roads and sanitation go to
                the municipality; power and water go to the relevant utility.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                {[
                  "20 cities and 60+ civic desks mapped",
                  "Electricity, water, municipal, and traffic bodies",
                  "PIN-code first, then city-level fallback",
                  "Complaint emailed directly to the desk's registered ID",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f7efe3] text-[10px] font-bold text-[var(--saffron)]">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-[var(--navy)] py-20 text-white">
        <Container className="text-center">
          <h2 className="font-display text-4xl">Ready to get started?</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            Create your free citizen account in under two minutes and file your
            first complaint today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/register">Create citizen account</Button>
            <Button
              variant="outline"
              href="/track"
              className="border-white/30 bg-white/10 text-white hover:border-amber-300 hover:text-amber-200"
            >
              Track an existing complaint
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
