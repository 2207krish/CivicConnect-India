"use client";

import { useMemo, useState } from "react";

import CivicBodyCard from "@/components/civic/CivicBodyCard";
import Container from "@/components/layout/Container";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { civicBodies, listCoveredCities } from "@/data/civic-bodies";
import AdSlot from "@/components/ads/AdSlot";

export default function CivicBodiesPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return civicBodies.filter((body) => {
      const matchesType = type === "all" || body.type === type;
      const haystack = `${body.name} ${body.city} ${body.state} ${body.email}`.toLowerCase();
      return matchesType && (!needle || haystack.includes(needle));
    });
  }, [query, type]);

  return (
    <section className="py-16">
      <Container>
        <h1 className="text-3xl font-bold">Civic body directory</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          These are the municipal corporations, electricity utilities, water boards
          and traffic desks currently mapped in CivicConnect. Coverage includes{" "}
          {listCoveredCities().length} city offices.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <Input
            label="Search by city, office or email"
            placeholder="Bengaluru, BESCOM, complaints@"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Select label="Desk type" value={type} onChange={(event) => setType(event.target.value)}>
            <option value="all">All desks</option>
            <option value="municipal">Municipal</option>
            <option value="electricity">Electricity</option>
            <option value="water">Water</option>
            <option value="traffic">Traffic</option>
          </Select>
        </div>

        <p className="mt-4 text-sm text-slate-500">{results.length} offices found</p>

        <AdSlot slotKey="directory" />

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {results.map((body) => (
            <CivicBodyCard
              key={body.id}
              match={{
                body,
                score: 0,
                distanceKm: null,
                matchReasons: body.departments.map((item) => item.replaceAll("_", " ")),
              }}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
