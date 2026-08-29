import { type Metadata } from "next";
import Hero from "@/components/home/Hero";
import AdSlot from "@/components/ads/AdSlot";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "CivicConnect India — Report civic problems to the right desk",
  description:
    "Register with your address, reach the nearest municipal, electricity or water office, and track your civic complaint with a unique CivicConnect ID.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <Container>
        <AdSlot slotKey="homeTop" />
      </Container>
    </>
  );
}
