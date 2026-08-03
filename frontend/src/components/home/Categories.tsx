import Container from "@/components/layout/Container";
import {
  Trash2,
  Lightbulb,
  Droplets,
  Trees,
  Dog,
  TrafficCone,
  Construction,
  Landmark,
} from "lucide-react";

const categories = [
  { title: "Road Damage", icon: Construction },
  { title: "Street Lights", icon: Lightbulb },
  { title: "Garbage", icon: Trash2 },
  { title: "Water Leakage", icon: Droplets },
  { title: "Parks", icon: Trees },
  { title: "Stray Animals", icon: Dog },
  { title: "Traffic", icon: TrafficCone },
  { title: "Public Property", icon: Landmark },
];

export default function Categories() {
  return (
    <section className="py-24">
      <Container>
        <div className="text-center">
          <h2 className="text-4xl font-bold">
            Categories We Support
          </h2>

          <p className="mt-4 text-slate-600">
            Report civic issues to the correct authority in just a few clicks.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  {item.title}
                </h3>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}