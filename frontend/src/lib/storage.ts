import { getCategory } from "@/data/categories";
import { getCivicBodyById } from "@/data/civic-bodies";
import { composeComplaintEmail, createDispatch } from "@/lib/email";
import { hashPassword } from "@/lib/hash";
import { assignHomeCivicBodies } from "@/lib/matching";
import { generateTrackingId, refreshComplaintStatus } from "@/lib/status";
import type {
  Address,
  Complaint,
  EmailDispatch,
  PublicUser,
  StoredUser,
} from "@/types";

const KEYS = {
  users: "civicconnect.users",
  session: "civicconnect.session",
  complaints: "civicconnect.complaints",
  dispatches: "civicconnect.dispatches",
  seeded: "civicconnect.seeded",
} as const;

function canUseStorage() {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function toPublicUser(user: StoredUser): PublicUser {
  const { salt, passwordHash, ...publicUser } = user;
  void salt;
  void passwordHash;
  return publicUser;
}

export function getUsers(): StoredUser[] {
  return readJson<StoredUser[]>(KEYS.users, []);
}

export function saveUsers(users: StoredUser[]) {
  writeJson(KEYS.users, users);
}

export function getSessionUserId() {
  return readJson<string | null>(KEYS.session, null);
}

export function setSessionUserId(userId: string | null) {
  if (!canUseStorage()) return;
  if (userId) {
    window.localStorage.setItem(KEYS.session, JSON.stringify(userId));
    return;
  }
  window.localStorage.removeItem(KEYS.session);
}

export function getCurrentUser(): PublicUser | null {
  const userId = getSessionUserId();
  if (!userId) return null;
  const user = getUsers().find((item) => item.id === userId);
  return user ? toPublicUser(user) : null;
}

export function getComplaints(): Complaint[] {
  const complaints = readJson<Complaint[]>(KEYS.complaints, []).map(
    refreshComplaintStatus
  );
  writeJson(KEYS.complaints, complaints);
  return complaints;
}

export function saveComplaints(complaints: Complaint[]) {
  writeJson(KEYS.complaints, complaints);
}

export function getDispatches(): EmailDispatch[] {
  return readJson<EmailDispatch[]>(KEYS.dispatches, []);
}

export function saveDispatches(dispatches: EmailDispatch[]) {
  writeJson(KEYS.dispatches, dispatches);
}

export function findUserByEmail(email: string) {
  return getUsers().find(
    (user) => user.email.toLowerCase() === email.trim().toLowerCase()
  );
}

export async function createUser(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: Address;
}) {
  if (findUserByEmail(input.email)) {
    throw new Error("An account with this email already exists.");
  }

  const salt = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  const nearest = assignHomeCivicBodies(input.address);
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    address: input.address,
    nearestBodyIds: nearest.map((item) => item.body.id),
    emailVerified: false,
    createdAt: new Date().toISOString(),
    salt,
    passwordHash: await hashPassword(input.password, salt),
  };

  saveUsers([...getUsers(), user]);
  return toPublicUser(user);
}

export function updateStoredUser(
  userId: string,
  patch: Partial<Pick<PublicUser, "name" | "phone" | "address" | "nearestBodyIds">>
) {
  const users = getUsers();
  const index = users.findIndex((user) => user.id === userId);
  if (index === -1) {
    throw new Error("Account not found.");
  }

  users[index] = { ...users[index], ...patch };
  saveUsers(users);
  return toPublicUser(users[index]);
}

export function getUserComplaints(userId: string) {
  return getComplaints()
    .filter((complaint) => complaint.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getComplaintByTrackingId(trackingId: string) {
  const normalized = trackingId.trim().toUpperCase();
  return (
    getComplaints().find(
      (complaint) => complaint.trackingId.toUpperCase() === normalized
    ) ?? null
  );
}

export function getComplaintById(id: string) {
  return getComplaints().find((complaint) => complaint.id === id) ?? null;
}

export function getDispatchForComplaint(complaintId: string) {
  return getDispatches().find((item) => item.complaintId === complaintId) ?? null;
}

export function createComplaint(input: {
  user: PublicUser;
  categoryId: string;
  title: string;
  description: string;
  landmark?: string;
  photos: Complaint["photos"];
  address: Address;
  civicBodyId: string;
}) {
  const civicBody = getCivicBodyById(input.civicBodyId);
  const category = getCategory(input.categoryId);
  if (!civicBody || !category) {
    throw new Error("Could not route this complaint to a civic body.");
  }

  const createdAt = new Date().toISOString();
  const trackingId = generateTrackingId(input.address.city);
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
    photos: input.photos,
    address: input.address,
    civicBodyId: civicBody.id,
    civicBodyName: civicBody.name,
    civicBodyEmail: civicBody.email,
    status: "email_sent",
    timeline: [
      {
        status: "submitted",
        at: createdAt,
        note: "Complaint registered on CivicConnect India.",
      },
      {
        status: "email_sent",
        at: createdAt,
        note: `Official complaint emailed to ${civicBody.email}.`,
      },
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
    civicBody,
  });

  saveComplaints([complaint, ...getComplaints()]);
  saveDispatches([createDispatch(complaint, civicBody, composed), ...getDispatches()]);

  return { complaint, dispatch: getDispatchForComplaint(complaint.id)! };
}

export function confirmComplaintResolution(complaintId: string, userId: string) {
  const complaints = getComplaints();
  const index = complaints.findIndex((item) => item.id === complaintId);
  if (index === -1 || complaints[index].userId !== userId) {
    throw new Error("Complaint not found.");
  }

  const now = new Date().toISOString();
  complaints[index] = {
    ...complaints[index],
    status: "resolved",
    updatedAt: now,
    timeline: [
      ...complaints[index].timeline,
      {
        status: "resolved",
        at: now,
        note: "You confirmed that the issue has been resolved.",
      },
    ],
  };
  saveComplaints(complaints);
  return complaints[index];
}

export async function seedDemoData() {
  if (!canUseStorage() || window.localStorage.getItem(KEYS.seeded)) {
    return;
  }

  const address: Address = {
    line1: "14, Barakhamba Road",
    area: "Connaught Place",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110001",
  };

  const salt = "demodemo1234salt";
  const demoUser: StoredUser = {
    id: "demo-anita-sharma",
    name: "Anita Sharma",
    email: "citizen@demo.in",
    phone: "9876543210",
    address,
    nearestBodyIds: assignHomeCivicBodies(address).map((item) => item.body.id),
    emailVerified: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    salt,
    passwordHash: await hashPassword("Demo@123", salt),
  };

  saveUsers([demoUser]);

  const older = new Date(Date.now() - 1000 * 60 * 12).toISOString();
  const recent = new Date(Date.now() - 1000 * 60 * 1).toISOString();
  const municipal = getCivicBodyById("municipal-new-delhi");
  const electricity = getCivicBodyById("electricity-new-delhi");

  if (municipal && electricity) {
    const roadComplaint: Complaint = {
      id: "demo-complaint-road",
      trackingId: "CCI-NEW-20260823-ROAD",
      userId: demoUser.id,
      citizenName: demoUser.name,
      citizenEmail: demoUser.email,
      citizenPhone: demoUser.phone,
      categoryId: "roads",
      title: "Deep pothole near Barakhamba crossing",
      description:
        "A large pothole has formed near the Barakhamba Road crossing. Two-wheelers are skidding after rain and traffic is slowing down during office hours.",
      landmark: "Opposite Statesman House",
      photos: [],
      address,
      civicBodyId: municipal.id,
      civicBodyName: municipal.name,
      civicBodyEmail: municipal.email,
      status: "in_progress",
      timeline: [
        {
          status: "submitted",
          at: older,
          note: "Complaint registered on CivicConnect India.",
        },
        {
          status: "email_sent",
          at: older,
          note: `Official complaint emailed to ${municipal.email}.`,
        },
        {
          status: "acknowledged",
          at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
          note: "The civic body desk has acknowledged your complaint.",
        },
        {
          status: "in_progress",
          at: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
          note: "A field team has been assigned and work is in progress.",
        },
      ],
      createdAt: older,
      updatedAt: older,
    };

    const lightComplaint: Complaint = {
      id: "demo-complaint-light",
      trackingId: "CCI-NEW-20260823-LITE",
      userId: demoUser.id,
      citizenName: demoUser.name,
      citizenEmail: demoUser.email,
      citizenPhone: demoUser.phone,
      categoryId: "street_lights",
      title: "Street lights out on the inner circle",
      description:
        "Three consecutive street lights on the inner circle have been dark for four nights, making the footpath unsafe for pedestrians.",
      landmark: "Near Palika Bazaar gate",
      photos: [],
      address,
      civicBodyId: municipal.id,
      civicBodyName: municipal.name,
      civicBodyEmail: municipal.email,
      status: "email_sent",
      timeline: [
        {
          status: "submitted",
          at: recent,
          note: "Complaint registered on CivicConnect India.",
        },
        {
          status: "email_sent",
          at: recent,
          note: `Official complaint emailed to ${municipal.email}.`,
        },
      ],
      createdAt: recent,
      updatedAt: recent,
    };

    saveComplaints([lightComplaint, roadComplaint]);
  }

  window.localStorage.setItem(KEYS.seeded, "1");
}
