import Container from "@/components/layout/Container";
import Card from "@/components/ui/Card";
import {
  UserRoundPlus,
  MapPin,
  Building2,
  Mail,
  ChartNoAxesColumn,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: UserRoundPlus,
    title: "Citizen registration",
    description:
      "Create an account, confirm the token emailed to you, then use your name, phone and address on every complaint.",
  },
  {
    icon: MapPin,
    title: "PIN-code matching",
    description:
      "We locate the nearest municipal, electricity and water desks from your address.",
  },
  {
    icon: Building2,
    title: "Correct authority",
    description:
      "Roads and sanitation go to the municipality; power and water go to the utility.",
  },
  {
    icon: Mail,
    title: "Official email routing",
    description:
      "Every complaint is sent to the civic body's registered email desk with a tracking ID.",
  },
  {
    icon: ChartNoAxesColumn,
    title: "Track later",
    description:
      "Follow acknowledgement, field work and resolution with your CivicConnect ID.",
  },
  {
    icon: ShieldCheck,
    title: "Your details stay with you",
    description:
      "Login is required to file, but anyone with the tracking ID can view the public status.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24">
      <Container>
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--saffron)]">
            Why this portal
          </p>
          <h2 className="font-display mt-3 text-4xl text-[var(--navy)]">
            Why choose CivicConnect?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Built around the real path a civic complaint should take: citizen,
            nearest office, official email, and a trackable record.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card key={feature.title}>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7efe3]">
                  <Icon className="h-7 w-7 text-[var(--saffron)]" />
                </div>
                <h3 className="font-display mt-6 text-2xl text-[var(--navy)]">
                  {feature.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
