import { getCategory } from "@/data/categories";
import { getCivicBodyById } from "@/data/civic-bodies";
import { composeComplaintEmail, createDispatch } from "@/lib/email";
import { findBestBodyForDepartment } from "@/lib/matching";
import { saveCompressedPhotos } from "@/lib/server/compress-image";
import { updateStore } from "@/lib/server/data-store";
import { generateTrackingId, refreshComplaintStatus } from "@/lib/status";
import type { Address, Complaint, EmailDispatch, PublicUser } from "@/types";

const FILE = "complaints.json";

interface ComplaintStore {
  complaints: Complaint[];
  dispatches: EmailDispatch[];
}

async function mutateComplaints(updater: (store: ComplaintStore) => ComplaintStore) {
  return updateStore<ComplaintStore>(
    FILE,
    { complaints: [], dispatches: [] },
    async (store) => {
      const seeded = store.complaints.some((item) => item.trackingId === "CCI-NEW-20260823-ROAD")
        ? store
        : seedDemo(store);
      const next = updater(seeded);
      next.complaints = next.complaints.map(refreshComplaintStatus);
      return next;
    }
  );
}

function seedDemo(store: ComplaintStore): ComplaintStore {
  const municipal = getCivicBodyById("municipal-new-delhi");
  if (!municipal) return store;
  const address: Address = {
    line1: "14, Barakhamba Road",
    area: "Connaught Place",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110001",
  };
  const older = new Date(Date.now() - 1000 * 60 * 12).toISOString();
  const recent = new Date(Date.now() - 1000 * 60 * 1).toISOString();
  const road: Complaint = {
    id: "demo-complaint-road",
    trackingId: "CCI-NEW-20260823-ROAD",
    userId: "demo-anita-sharma",
    citizenName: "Anita Sharma",
    citizenEmail: "citizen@demo.in",
    citizenPhone: "9876543210",
    categoryId: "roads",
    title: "Deep pothole near Barakhamba crossing",
    description:
      "A large pothole has formed near the Barakhamba Road crossing after rain.",
    landmark: "Opposite Statesman House",
    photos: [],
    address,
    civicBodyId: municipal.id,
    civicBodyName: municipal.name,
    civicBodyEmail: municipal.email,
    status: "in_progress",
    timeline: [
      { status: "submitted", at: older, note: "Complaint registered on CivicConnect India." },
      { status: "email_sent", at: older, note: `Official complaint emailed to ${municipal.email}.` },
      { status: "acknowledged", at: new Date(Date.now() - 1000 * 60 * 8).toISOString(), note: "The civic body desk has acknowledged your complaint." },
      { status: "in_progress", at: new Date(Date.now() - 1000 * 60 * 4).toISOString(), note: "A field team has been assigned and work is in progress." },
    ],
    createdAt: older,
    updatedAt: older,
  };
  const light: Complaint = {
    id: "demo-complaint-light",
    trackingId: "CCI-NEW-20260823-LITE",
    userId: "demo-anita-sharma",
    citizenName: "Anita Sharma",
    citizenEmail: "citizen@demo.in",
    citizenPhone: "9876543210",
    categoryId: "street_lights",
    title: "Street lights out on the inner circle",
    description: "Three consecutive street lights on the inner circle have been dark for four nights.",
    landmark: "Near Palika Bazaar gate",
    photos: [],
    address,
    civicBodyId: municipal.id,
    civicBodyName: municipal.name,
    civicBodyEmail: municipal.email,
    status: "email_sent",
    timeline: [
      { status: "submitted", at: recent, note: "Complaint registered on CivicConnect India." },
      { status: "email_sent", at: recent, note: `Official complaint emailed to ${municipal.email}.` },
    ],
    createdAt: recent,
    updatedAt: recent,
  };
  return { complaints: [light, road, ...store.complaints], dispatches: store.dispatches };
}

export async function listUserComplaints(userId: string) {
  const store = await mutateComplaints((current) => current);
  return store.complaints
    .filter((item) => item.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function findComplaintByTrackingId(trackingId: string) {
  const store = await mutateComplaints((current) => current);
  const normalized = trackingId.trim().toUpperCase();
  const complaint =
    store.complaints.find((item) => item.trackingId.toUpperCase() === normalized) ?? null;
  const dispatch = complaint
    ? store.dispatches.find((item) => item.complaintId === complaint.id) ?? null
    : null;
  return { complaint, dispatch };
}

export async function createServerComplaint(input: {
  user: PublicUser;
  categoryId: string;
  title: string;
  description: string;
  landmark?: string;
  address: Address;
  photos?: { name?: string; dataUrl?: string }[];
}) {
  const category = getCategory(input.categoryId);
  if (!category) throw new Error("Unknown complaint category.");
  const match = findBestBodyForDepartment(input.address, category.department);
  if (!match) throw new Error("Could not find a civic body for this location.");

  const createdAt = new Date().toISOString();
  const trackingId = generateTrackingId(input.address.city);
  const photos = await saveCompressedPhotos(input.photos);
  const complaint: Complaint = {
    id: crypto.randomUUID(),
    trackingId,
    userId: input.user.id,
    citizenName: input.user.name,
    citizenEmail: input.user.email,
    citizenPhone: input.user.phone,
    categoryId: input.categoryId,
    title: input.title.trim(),
    description: input.description.trim(),
    landmark: input.landmark?.trim() || undefined,
    photos,
    address: input.address,
    civicBodyId: match.body.id,
    civicBodyName: match.body.name,
    civicBodyEmail: match.body.email,
    status: "email_sent",
    timeline: [
      { status: "submitted", at: createdAt, note: "Complaint registered on CivicConnect India." },
      { status: "email_sent", at: createdAt, note: `Official complaint emailed to ${match.body.email}.` },
    ],
    createdAt,
    updatedAt: createdAt,
  };
  const composed = composeComplaintEmail({
    trackingId,
    citizenName: input.user.name,
    citizenEmail: input.user.email,
    citizenPhone: input.user.phone,
    categoryTitle: category.title,
    title: complaint.title,
    description: complaint.description,
    landmark: complaint.landmark,
    address: input.address,
    civicBody: match.body,
    photoCount: photos.length,
  });
  const dispatch = createDispatch(complaint, match.body, composed);

  await mutateComplaints((store) => ({
    complaints: [complaint, ...store.complaints],
    dispatches: [dispatch, ...store.dispatches],
  }));

  return { complaint, dispatch };
}

export async function resolveServerComplaint(complaintId: string, userId: string) {
  let updated: Complaint | null = null;
  await mutateComplaints((store) => ({
    ...store,
    complaints: store.complaints.map((item) => {
      if (item.id !== complaintId || item.userId !== userId) return item;
      const now = new Date().toISOString();
      updated = {
        ...item,
        status: "resolved",
        updatedAt: now,
        timeline: [
          ...item.timeline,
          { status: "resolved", at: now, note: "You confirmed that the issue has been resolved." },
        ],
      };
      return updated;
    }),
  }));
  if (!updated) throw new Error("Complaint not found.");
  return updated;
}

