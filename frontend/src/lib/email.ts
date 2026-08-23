import { formatAddress } from "@/lib/matching";
import type { Address, CivicBody, Complaint, EmailDispatch } from "@/types";

export function composeComplaintEmail(input: {
  trackingId: string;
  citizenName: string;
  citizenEmail: string;
  citizenPhone: string;
  categoryTitle: string;
  title: string;
  description: string;
  landmark?: string;
  address: Address;
  civicBody: CivicBody;
}) {
  const subject = `[${input.trackingId}] Civic complaint — ${input.categoryTitle} — ${input.address.area || input.address.city}`;

  const body = [
    `To`,
    `The Concerned Officer`,
    `${input.civicBody.name}`,
    `${input.civicBody.address}, ${input.civicBody.city} - ${input.civicBody.pincode}`,
    ``,
    `Subject: ${subject}`,
    ``,
    `Respected Sir/Madam,`,
    ``,
    `I, ${input.citizenName}, a resident of ${formatAddress(input.address)}, wish to formally register the following civic complaint through CivicConnect India.`,
    ``,
    `Tracking ID: ${input.trackingId}`,
    `Category: ${input.categoryTitle}`,
    `Issue title: ${input.title}`,
    input.landmark ? `Nearby landmark: ${input.landmark}` : null,
    `Location: ${formatAddress(input.address)}`,
    ``,
    `Details of the problem:`,
    input.description,
    ``,
    `I request you to kindly inspect the site and take necessary action at the earliest. I am available on ${input.citizenPhone} / ${input.citizenEmail} for any clarification.`,
    ``,
    `Yours faithfully,`,
    input.citizenName,
    input.citizenPhone,
    input.citizenEmail,
    ``,
    `This complaint was routed by CivicConnect India to the registered desk of ${input.civicBody.shortName}.`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return { subject, body };
}

export function buildMailto(dispatch: Pick<EmailDispatch, "to" | "subject" | "body">) {
  const params = new URLSearchParams({
    subject: dispatch.subject,
    body: dispatch.body,
  });

  return `mailto:${dispatch.to}?${params.toString()}`;
}

export function createDispatch(complaint: Complaint, civicBody: CivicBody, composed: {
  subject: string;
  body: string;
}): EmailDispatch {
  return {
    id: `mail-${complaint.id}`,
    complaintId: complaint.id,
    trackingId: complaint.trackingId,
    to: civicBody.email,
    toName: civicBody.name,
    subject: composed.subject,
    body: composed.body,
    sentAt: new Date().toISOString(),
  };
}
