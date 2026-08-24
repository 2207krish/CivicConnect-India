import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import { civicImages } from "@/config/media";

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden">
      <img
        src={civicImages.hero}
        alt="India Gate and the central vista in New Delhi"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(11,27,51,0.92)] via-[rgba(11,27,51,0.72)] to-[rgba(11,27,51,0.28)]" />

      <Container className="relative grid items-center gap-12 py-28 lg:grid-cols-2">
        <div className="text-white">
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-amber-200 backdrop-blur">
            Built for every citizen of India
          </span>
          <h1 className="font-display mt-8 text-5xl leading-tight lg:text-6xl">
            Report civic problems{" "}
            <span className="text-amber-300">to the right desk</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-200">
            Register with your address, reach the nearest municipal, electricity
            or water office, and track the complaint with a unique CivicConnect ID.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/register">Create citizen account</Button>
            <Button
              variant="outline"
              href="/download"
              className="border-white/30 bg-white/10 text-white hover:border-amber-300 hover:text-amber-200"
            >
              Download Android app
            </Button>
            <Button
              variant="outline"
              href="/track"
              className="border-white/30 bg-white/10 text-white hover:border-amber-300 hover:text-amber-200"
            >
              Track a complaint
            </Button>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/15 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-md">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">
            Citizen path
          </p>
          <h2 className="font-display mt-3 text-3xl">What you can do today</h2>
          <div className="mt-8 space-y-5">
            <Item label="1. Register" value="Name, email, phone and address" />
            <Item label="2. Nearest civic body" value="Matched by PIN code and city" />
            <Item label="3. File complaint" value="Sent to the official email desk" />
            <Item label="4. Track later" value="Use your CivicConnect ID" />
            <Button className="mt-2 w-full" href="/complaints/new">
              File a complaint
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/10 pb-4 last:border-0">
      <p className="text-sm text-amber-200">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
