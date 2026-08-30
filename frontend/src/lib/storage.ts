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


