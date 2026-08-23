import type { Department } from "@/types";
import {
  Construction,
  Lightbulb,
  Trash2,
  Droplets,
  Trees,
  Dog,
  TrafficCone,
  Landmark,
  Zap,
  Waves,
} from "lucide-react";

export interface ComplaintCategory {
  id: string;
  title: string;
  description: string;
  department: Department;
  icon: typeof Construction;
}

export const complaintCategories: ComplaintCategory[] = [
  {
    id: "roads",
    title: "Roads & Potholes",
    description: "Broken roads, potholes, missing signage",
    department: "roads",
    icon: Construction,
  },
  {
    id: "electricity",
    title: "Electricity",
    description: "Power cuts, snapped lines, transformer issues",
    department: "electricity",
    icon: Zap,
  },
  {
    id: "sanitation",
    title: "Sanitation & Drainage",
    description: "Open drains, sewage overflow, blocked gutters",
    department: "sanitation",
    icon: Waves,
  },
  {
    id: "water",
    title: "Water Supply",
    description: "Leakage, no supply, contaminated water",
    department: "water",
    icon: Droplets,
  },
  {
    id: "garbage",
    title: "Garbage & Waste",
    description: "Uncollected waste, dumping, overflowing bins",
    department: "garbage",
    icon: Trash2,
  },
  {
    id: "street_lights",
    title: "Street Lights",
    description: "Dark stretches, damaged poles, flickering lights",
    department: "street_lights",
    icon: Lightbulb,
  },
  {
    id: "parks",
    title: "Parks & Open Spaces",
    description: "Neglected parks, broken benches, unsafe play areas",
    department: "parks",
    icon: Trees,
  },
  {
    id: "stray_animals",
    title: "Stray Animals",
    description: "Injured animals, aggressive packs, carcass removal",
    department: "stray_animals",
    icon: Dog,
  },
  {
    id: "traffic",
    title: "Traffic Issues",
    description: "Faulty signals, illegal parking, congestion points",
    department: "traffic",
    icon: TrafficCone,
  },
  {
    id: "public_property",
    title: "Public Property",
    description: "Damaged footpaths, bus stops, government buildings",
    department: "public_property",
    icon: Landmark,
  },
];

export function getCategory(id: string) {
  return complaintCategories.find((category) => category.id === id);
}
