import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import HowItWorks from "@/components/home/HowItWorks";
import Features from "@/components/home/Features";
import Statistics from "@/components/home/Statistics";
export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Categories />
        <HowItWorks />
        <Features />
        <Statistics />
      </main>
    </>
  );
}