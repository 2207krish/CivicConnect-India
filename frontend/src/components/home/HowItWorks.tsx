import { UserPlus, Building2, Mail, Search } from "lucide-react";
import Container from "@/components/layout/Container";

const steps = [
  {
    icon: UserPlus,
    title: "Register and verify email",
    description: "Share your details, then enter the one-time token sent to your inbox.",
  },
  {
    icon: Building2,
    title: "See the nearest civic body",
    description: "We match municipal, electricity and water desks near your PIN code.",
  },
  {
    icon: Mail,
    title: "Email the official desk",
    description: "Your complaint is sent to the civic body's registered email ID.",
  },
  {
    icon: Search,
    title: "Track the complaint",
    description: "Use your tracking ID any time to see acknowledgement and progress.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#efe7d8] py-24">
      <Container>
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--saffron)]">
            Simple path
          </p>
          <h2 className="font-display mt-3 text-4xl text-[var(--navy)]">How it works</h2>
          <p className="mt-4 text-slate-600">
            From your address to the correct civic desk, in four steps.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="rounded-3xl bg-white p-8 text-center shadow-[0_14px_36px_rgba(20,32,51,0.06)]"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f7efe3]">
                  <Icon className="h-7 w-7 text-[var(--saffron)]" />
                </div>
                <div className="mt-6 text-sm font-bold text-[var(--saffron)]">
                  Step {index + 1}
                </div>
                <h3 className="font-display mt-3 text-2xl text-[var(--navy)]">{step.title}</h3>
                <p className="mt-3 text-slate-600">{step.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
