import { getCategory } from "@/data/categories";
import { composeComplaintEmail, createDispatch } from "@/lib/email";
import { findBestBodyForDepartment } from "@/lib/matching";
import { saveCompressedPhotos } from "@/lib/server/compress-image";
import { updateStore } from "@/lib/server/data-store";
import { isSmtpConfigured, sendMail } from "@/lib/server/mailer";
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
      const next = updater(store);
      next.complaints = next.complaints.map(refreshComplaintStatus);
      return next;
    }
  );
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
    status: "submitted",
    timeline: [
      { status: "submitted", at: createdAt, note: "Complaint registered on CivicConnect India." },
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

  // Actually send the complaint email via Resend if configured
  let emailSent = false;
  if (isSmtpConfigured()) {
    try {
      await sendMail({
        to: match.body.email,
        subject: composed.subject,
        text: composed.body,
        html: `<pre style="font-family:Arial,sans-serif;white-space:pre-wrap;max-width:640px;margin:0 auto">${composed.body}</pre>`,
      });
      emailSent = true;
    } catch (error) {
      console.error(`[complaint] Failed to email ${match.body.email}:`, error);
    }
  }

  // Update status based on whether the email was actually sent
  if (emailSent) {
    complaint.status = "email_sent";
    complaint.timeline.push({
      status: "email_sent",
      at: createdAt,
      note: `Official complaint emailed to ${match.body.email}.`,
    });
  } else {
    complaint.timeline.push({
      status: "submitted",
      at: createdAt,
      note: isSmtpConfigured()
        ? `Email to ${match.body.email} could not be delivered. Use the mailto link on the tracking page to send manually.`
        : `Email not configured — use the mailto link on the tracking page to send the complaint manually.`,
    });
  }

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

