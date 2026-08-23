import Link from "next/link";
import Container from "@/components/layout/Container";
import { civicImages, categoryImages } from "@/config/media";
import { complaintCategories } from "@/data/categories";

export default function Categories() {
  return (
    <section id="categories" className="py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--saffron)]">
            Civic issues
          </p>
          <h2 className="font-display mt-3 text-4xl text-[var(--navy)]">
            Categories we support
          </h2>
          <p className="mt-4 text-slate-600">
            Choose the issue type and we route it to the municipal, electricity,
            water or traffic desk that handles it.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {complaintCategories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.id}
                href={`/complaints/new?category=${category.id}`}
                className="group overflow-hidden rounded-3xl border border-[#e5dccb] bg-white shadow-[0_12px_30px_rgba(20,32,51,0.06)]"
              >
                <div className="relative h-28 overflow-hidden">
                  <img
                    src={categoryImages[category.id] ?? civicImages.city}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(11,27,51,0.55)] to-transparent" />
                  <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90">
                    <Icon className="h-5 w-5 text-[var(--saffron)]" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-[var(--navy)]">{category.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{category.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
