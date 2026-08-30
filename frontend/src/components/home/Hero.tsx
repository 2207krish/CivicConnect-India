import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-br from-[#0b1b33] via-[#122b52] to-[#0a182d] text-white"
    >
      {/* Ambient glowing gradients & mesh accents */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-[var(--saffron)]/15 blur-[130px]" />
        <div className="absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-[var(--green)]/15 blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <Container className="relative grid items-center gap-12 py-24 sm:py-28 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-amber-200 backdrop-blur-md shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[var(--saffron)] animate-pulse" />
            Built for every citizen of India
          </span>
          <h1 className="font-display mt-8 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            Report civic problems{" "}
            <span className="text-amber-300">to the right desk</span>
          </h1>
          <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-slate-200">
            Register with your address, reach the nearest municipal, electricity
            or water office, and track the complaint with a unique CivicConnect ID.
          </p>
          <div className="mt-10 flex flex-wrap gap-3.5">
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
            <Button
              variant="outline"
              href="/learn"
              className="border-white/30 bg-white/10 text-white hover:border-amber-300 hover:text-amber-200"
            >
              Civic awareness guide
            </Button>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/20 bg-white/[0.08] p-7 sm:p-9 text-white shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
            Citizen path
          </p>
          <h2 className="font-display mt-2 text-2xl sm:text-3xl font-bold">What you can do today</h2>
          <div className="mt-7 space-y-4">
            <Item label="1. Register" value="Name, email, phone and address" />
            <Item label="2. Nearest civic body" value="Matched by PIN code and city" />
            <Item label="3. File complaint" value="Sent to the official email desk" />
            <Item label="4. Track later" value="Use your CivicConnect ID" />
            <Button className="mt-4 w-full text-base py-3" href="/complaints/new">
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
    <div className="border-b border-white/10 pb-3.5 last:border-0 last:pb-0">
      <p className="text-xs sm:text-sm font-medium text-amber-200">{label}</p>
      <p className="mt-0.5 font-semibold text-white text-sm sm:text-base">{value}</p>
    </div>
  );
}
