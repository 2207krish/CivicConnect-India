import type { Complaint, ComplaintStatus, TimelineEvent } from "@/types";

const STATUS_LABELS: Record<ComplaintStatus, string> = {
  submitted: "Submitted",
  email_sent: "Emailed to civic body",
  acknowledged: "Acknowledged",
  in_progress: "In progress",
  resolved: "Resolved",
  rejected: "Rejected",
};

const STATUS_TONES: Record<ComplaintStatus, string> = {
  submitted: "bg-slate-100 text-slate-700",
  email_sent: "bg-blue-100 text-blue-700",
  acknowledged: "bg-amber-100 text-amber-800",
  in_progress: "bg-indigo-100 text-indigo-700",
  resolved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

const FLOW: ComplaintStatus[] = [
  "submitted",
  "email_sent",
  "acknowledged",
  "in_progress",
  "resolved",
];

export function statusLabel(status: ComplaintStatus) {
  return STATUS_LABELS[status];
}

export function statusTone(status: ComplaintStatus) {
  return STATUS_TONES[status];
}

function ageInMinutes(iso: string) {
  return (Date.now() - new Date(iso).getTime()) / 60000;
}

function expectedStatus(createdAt: string): ComplaintStatus {
  const minutes = ageInMinutes(createdAt);
  if (minutes >= 15) return "resolved";
  if (minutes >= 5) return "in_progress";
  if (minutes >= 2) return "acknowledged";
  return "email_sent";
}

const AUTO_NOTES: Partial<Record<ComplaintStatus, string>> = {
  acknowledged: "The civic body desk has acknowledged your complaint.",
  in_progress: "A field team has been assigned and work is in progress.",
  resolved: "The civic body has marked this complaint as resolved.",
};

export function refreshComplaintStatus(complaint: Complaint): Complaint {
  if (complaint.status === "resolved" || complaint.status === "rejected") {
    return complaint;
  }

  const nextStatus = expectedStatus(complaint.createdAt);
  const currentIndex = FLOW.indexOf(complaint.status);
  const nextIndex = FLOW.indexOf(nextStatus);

  if (nextIndex <= currentIndex) {
    return complaint;
  }

  const timeline = [...complaint.timeline];
  for (let index = currentIndex + 1; index <= nextIndex; index += 1) {
    const status = FLOW[index];
    const alreadyLogged = timeline.some((event) => event.status === status);
    if (!alreadyLogged) {
      const event: TimelineEvent = {
        status,
        at: new Date().toISOString(),
        note: AUTO_NOTES[status] ?? statusLabel(status),
      };
      timeline.push(event);
    }
  }

  return {
    ...complaint,
    status: nextStatus,
    timeline,
    updatedAt: new Date().toISOString(),
  };
}

export function generateTrackingId(city: string) {
  const cityCode = city.replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase() || "IND";
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CCI-${cityCode}-${stamp}-${random}`;
}
