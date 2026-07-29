import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 pt-20">
        <section className="mx-auto max-w-7xl px-6 py-24">
          <h1 className="text-5xl font-extrabold tracking-tight">
            CivicConnect India
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-slate-600">
            AI-powered civic complaint platform that helps citizens report
            road damage, sanitation issues, garbage, street lighting, stray
            animals, and other civic problems to the correct local authority.
          </p>
        </section>
      </main>
    </>
  );
}