import type { Address, Complaint, EmailDispatch } from "@/types";

async function parse<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }
  return data;
}

export async function apiListComplaints() {
  return parse<{ complaints: Complaint[] }>(await fetch("/api/complaints"));
}

export async function apiCreateComplaint(input: {
  categoryId: string;
  title: string;
  description: string;
  landmark?: string;
  useRegisteredAddress: boolean;
  address: Address;
}) {
  return parse<{ ok: true; complaint: Complaint; dispatch: EmailDispatch }>(
    await fetch("/api/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
  );
}

export async function apiTrackComplaint(id: string) {
  return parse<{ complaint: Complaint; dispatch: EmailDispatch | null }>(
    await fetch(`/api/track?id=${encodeURIComponent(id)}`)
  );
}

export async function apiResolveComplaint(id: string) {
  return parse<{ ok: true; complaint: Complaint }>(
    await fetch("/api/complaints/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
  );
}
