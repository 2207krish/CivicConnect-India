import Container from "@/components/layout/Container";
import Card from "@/components/ui/Card";
import {
  Sparkles,
  MapPin,
  Building2,
  Camera,
  ChartNoAxesColumn,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Complaint Draft",
    description:
      "Generate a clear and professional complaint in seconds.",
  },
  {
    icon: MapPin,
    title: "Auto Location",
    description:
      "Automatically detect the complaint location using GPS.",
  },
  {
    icon: Building2,
    title: "Smart Authority Mapping",
    description:
      "Route complaints to the appropriate government department.",
  },
  {
    icon: Camera,
    title: "Photo Evidence",
    description:
      "Attach images to provide better context for your complaint.",
  },
  {
    icon: ChartNoAxesColumn,
    title: "Track Progress",
    description:
      "Monitor complaint status from submission to resolution.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Platform",
    description:
      "Your complaint data is handled securely and responsibly.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24">
      <Container>
        <div className="text-center">
          <h2 className="text-4xl font-bold">
            Why Choose CivicConnect?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Everything you need to report civic issues quickly,
            accurately, and efficiently.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card key={feature.title}>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}