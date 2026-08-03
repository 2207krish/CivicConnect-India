import Container from "@/components/layout/Container";
import Card from "@/components/ui/Card";
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
  { title: "Traffic Issues", icon: TrafficCone },
  { title: "Public Property", icon: Landmark },
];

export default function Categories() {
  return (
    <section id="categories" className="py-24">
      <Container>
        <div className="text-center">
          <h2 className="text-4xl font-bold">
            Categories We Support
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Report civic issues to the correct authority in just a few clicks.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Card
                key={category.title}
                className="p-6 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  {category.title}
                </h3>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}