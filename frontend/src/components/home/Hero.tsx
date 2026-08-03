import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section id="hero" className="bg-gradient-to-b from-blue-50 via-white to-white py-24">
       
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Left */}
          <div>
            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              🇮🇳 Built for Every Citizen of India
            </span>

            <h1 className="mt-8 text-5xl font-extrabold leading-tight lg:text-6xl">
              Report Civic Problems{" "}
              <span className="text-blue-600">
                in Minutes
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg text-slate-600">
              Report potholes, garbage, drainage, sanitation,
              street lights, water leakage and more to the
              correct authority with AI assistance.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button>
                Report Complaint
              </Button>

              <Button variant="outline">
                Learn More
              </Button>
            </div>
          </div>

          {/* Right */}
          <div className="rounded-3xl border bg-white p-8 shadow-xl">

            <h2 className="mb-8 text-xl font-bold">
              Complaint Preview
            </h2>

            <div className="space-y-5">

              <Item
                label="Category"
                value="Road Damage"
              />

              <Item
                label="Location"
                value="Auto Detected"
              />

              <Item
                label="Authority"
                value="Municipal Corporation"
              />

              <Item
                label="Photos"
                value="3 Attached"
              />

              <Button className="mt-4 w-full">
                Generate Complaint
              </Button>

            </div>

          </div>

        </div>
      </Container>
    </section>
  );
}

function Item({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="font-semibold">
        {value}
      </p>
    </div>
  );
}