import { civicBodies } from "@/data/civic-bodies";
import { getCityMeta } from "@/data/locations";
import type {
  Address,
  CivicBody,
  Department,
  MatchedCivicBody,
} from "@/types";

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadius = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return 2 * earthRadius * Math.asin(Math.sqrt(a));
}

function scoreBody(
  body: CivicBody,
  address: Address,
  department?: Department
): MatchedCivicBody {
  let score = 0;
  const reasons: string[] = [];
  const cityMeta = getCityMeta(address.city, address.state);
  const prefix = address.pincode.slice(0, 3);

  if (department && body.departments.includes(department)) {
    score += 30;
    reasons.push("Handles this complaint type");
  }

  if (body.pincode === address.pincode) {
    score += 100;
    reasons.push("Exact PIN code match");
  } else if (body.pincodePrefixes.includes(prefix)) {
    score += 55;
    reasons.push("Same postal circle");
  }

  if (body.city.toLowerCase() === address.city.trim().toLowerCase()) {
    score += 40;
    reasons.push("Same city");
  } else if (body.state.toLowerCase() === address.state.trim().toLowerCase()) {
    score += 12;
    reasons.push("Same state");
  }

  let distanceKm: number | null = null;
  if (cityMeta) {
    distanceKm = Number(
      haversineKm(cityMeta.lat, cityMeta.lng, body.lat, body.lng).toFixed(1)
    );
    score += Math.max(0, 25 - Math.min(25, distanceKm));
    if (distanceKm <= 8) {
      reasons.push(`About ${distanceKm} km from your locality`);
    }
  }

  return { body, score, distanceKm, matchReasons: reasons };
}

export function findNearestBodies(
  address: Address,
  department?: Department,
  limit = 4
): MatchedCivicBody[] {
  const ranked = civicBodies
    .filter((body) => (department ? body.departments.includes(department) : true))
    .map((body) => scoreBody(body, address, department))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const distanceA = a.distanceKm ?? 9999;
      const distanceB = b.distanceKm ?? 9999;
      return distanceA - distanceB;
    });

  const withLocalSignal = ranked.filter((item) => item.score >= 40);
  const pool = withLocalSignal.length > 0 ? withLocalSignal : ranked;

  const uniqueByType = new Map<string, MatchedCivicBody>();
  for (const match of pool) {
    if (!uniqueByType.has(match.body.type)) {
      uniqueByType.set(match.body.type, match);
    }
  }

  return [...uniqueByType.values()].slice(0, limit);
}

export function findBestBodyForDepartment(
  address: Address,
  department: Department
) {
  return findNearestBodies(address, department, 1)[0] ?? null;
}

export function assignHomeCivicBodies(address: Address) {
  const municipal = findBestBodyForDepartment(address, "roads");
  const electricity = findBestBodyForDepartment(address, "electricity");
  const water = findBestBodyForDepartment(address, "water");
  const traffic = findBestBodyForDepartment(address, "traffic");

  const matches = [municipal, electricity, water, traffic].filter(
    (item): item is MatchedCivicBody => Boolean(item)
  );

  const seen = new Set<string>();
  return matches.filter((item) => {
    if (seen.has(item.body.id)) return false;
    seen.add(item.body.id);
    return true;
  });
}

export function formatAddress(address: Address) {
  return [address.line1, address.area, address.city, address.state, address.pincode]
    .filter(Boolean)
    .join(", ");
}
