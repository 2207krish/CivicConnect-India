import { type Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import { civicImages, categoryImages } from "@/config/media";
import { complaintCategories } from "@/data/categories";

export const metadata: Metadata = {
  title: "Complaint Categories — CivicConnect India",
  description:
    "Browse all 10 civic complaint categories: roads, electricity, water, sanitation, public transport, noise, trees, stray animals, and more. Choose your issue and file directly to the right desk.",
};

export default function CategoriesPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-[var(--navy)] py-20 text-white">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
            Civic issues
          </p>
          <h1 className="font-display mt-4 text-5xl leading-tight lg:text-6xl">
            What can we help you report?
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Choose the issue type below and CivicConnect automatically routes it
            to the right municipal, electricity, water, or traffic desk.
          </p>
        </Container>
      </section>

      {/* Categories grid */}
      <section className="py-24">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {complaintCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.id}
                  href={`/complaints/new?category=${category.id}`}
                  className="group overflow-hidden rounded-3xl border border-[#e5dccb] bg-white shadow-[0_12px_30px_rgba(20,32,51,0.06)] transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(20,32,51,0.12)]"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={categoryImages[category.id] ?? civicImages.city}
                      alt=""
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(11,27,51,0.6)] to-transparent" />
                    <div className="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 shadow">
                      <Icon className="h-5 w-5 text-[var(--saffron)]" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h2 className="font-semibold text-[var(--navy)]">
                      {category.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {category.description}
                    </p>
                    <p className="mt-4 text-xs font-semibold text-[var(--saffron)] transition-all group-hover:translate-x-1">
                      File complaint →
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Info strip */}
      <section className="bg-[#efe7d8] py-16">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                label: "PIN-code routing",
                desc: "We match your address to the exact civic body that handles your area.",
              },
              {
                label: "Email to the right desk",
                desc: "Roads go to the municipality; power and water go to the relevant utility.",
              },
              {
                label: "Track with one ID",
                desc: "Get a CivicConnect ID instantly and use it to follow your complaint anytime.",
              },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-[var(--navy)]">{item.label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20">
        <Container className="text-center">
          <h2 className="font-display text-4xl text-[var(--navy)]">
            Not sure which category?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Just start filing — the complaint form will guide you, and our system
            will route it to the best-matched civic desk.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/complaints/new">File a complaint now</Button>
            <Button variant="outline" href="/how-it-works">
              How routing works
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
