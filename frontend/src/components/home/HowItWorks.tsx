import {
  MapPin,
  Camera,
  Sparkles,
  Send,
} from "lucide-react";

import Container from "@/components/layout/Container";

const steps = [
  {
    icon: MapPin,
    title: "Report Issue",
    description:
      "Choose the complaint category and location.",
  },
  {
    icon: Camera,
    title: "Upload Photos",
    description:
      "Attach images of the civic issue.",
  },
  {
    icon: Sparkles,
    title: "AI Draft",
    description:
      "Generate a professional complaint instantly.",
  },
  {
    icon: Send,
    title: "Submit",
    description:
      "Send it to the appropriate authority.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-50 py-24">
      <Container>
        <div className="text-center">
          <h2 className="text-4xl font-bold">
            How It Works
          </h2>

          <p className="mt-4 text-slate-600">
            Report any civic issue in four simple steps.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="rounded-2xl bg-white p-8 text-center shadow-sm"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>

                <div className="mt-6 text-sm font-bold text-blue-600">
                  Step {index + 1}
                </div>

                <h3 className="mt-3 text-xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-3 text-slate-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}