import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import HowItWorks from "@/components/home/HowItWorks";
import Features from "@/components/home/Features";
import Statistics from "@/components/home/Statistics";
import FAQ from "@/components/home/FAQ";
import CivicGuide from "@/components/home/CivicGuide";
import AndroidApp from "@/components/home/AndroidApp";
import AdSlot from "@/components/ads/AdSlot";
import Container from "@/components/layout/Container";

export default function Home() {
  return (
    <>
      <Hero />
      <Container>
        <AdSlot slotKey="homeTop" />
      </Container>
      <Categories />
      <HowItWorks />
      <Container>
        <AdSlot slotKey="homeMid" />
      </Container>
      <Features />
      <Statistics />
      <Container>
        <AdSlot slotKey="homeBottom" />
      </Container>
      <CivicGuide />
      <FAQ />
      <AndroidApp />
    </>
  );
}
