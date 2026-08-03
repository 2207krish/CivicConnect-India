import Container from "@/components/layout/Container";
import Card from "@/components/ui/Card";

const stats = [
  {
    value: "25K+",
    label: "Complaints Submitted",
  },
  {
    value: "500+",
    label: "Cities Covered",
  },
  {
    value: "50+",
    label: "Government Authorities",
  },
  {
    value: "95%",
    label: "Successful Routing",
  },
];

export default function Statistics() {
  return (
    <section id="statistics" className="bg-blue-600 py-24 text-white">
      <Container>
        <div className="text-center">
          <h2 className="text-4xl font-bold">
            Trusted by Citizens Across India
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            CivicConnect simplifies civic issue reporting by connecting
            citizens with the right authorities.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="border-white/20 bg-white/10 p-8 text-center shadow-none hover:bg-white/20"
            >
              <h3 className="text-5xl font-bold text-white">
                {stat.value}
              </h3>

              <p className="mt-3 text-blue-100">
                {stat.label}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}