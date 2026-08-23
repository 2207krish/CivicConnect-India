import Container from "@/components/layout/Container";
import { civicImages } from "@/config/media";

const stats = [
  { value: "20", label: "Cities mapped" },
  { value: "60+", label: "Civic desks on file" },
  { value: "10", label: "Complaint categories" },
  { value: "1 ID", label: "To track any case" },
];

export default function Statistics() {
  return (
    <section id="statistics" className="relative overflow-hidden py-24 text-white">
      <img
        src={civicImages.gateway}
        alt="Gateway of India"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[rgba(11,27,51,0.82)]" />
      <Container className="relative">
        <div className="text-center">
          <h2 className="font-display text-4xl">Trusted by citizens across India</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-200">
            CivicConnect simplifies civic issue reporting by connecting citizens
            with the right authorities.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/15 bg-white/10 p-8 text-center backdrop-blur-md"
            >
              <h3 className="font-display text-5xl text-amber-300">{stat.value}</h3>
              <p className="mt-3 text-slate-200">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
