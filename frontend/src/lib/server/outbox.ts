import { updateStore } from "@/lib/server/data-store";

const FILE = "outbox.json";

export interface OutboxMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
  otp: string;
  verifyUrl: string;
  previewUrl: string | null;
  sentAt: string;
  delivery: "preview" | "smtp";
}

export async function saveOutboxMessage(message: OutboxMessage) {
  await updateStore<OutboxMessage[]>(FILE, [], (messages) => [
    message,
    ...messages.filter((item) => item.to !== message.to),
  ].slice(0, 50));
}

export async function getOutboxMessage(email: string) {
  const messages = await updateStore<OutboxMessage[]>(FILE, [], (items) => items);
  return (
    messages.find((item) => item.to === email.trim().toLowerCase()) ?? null
  );
}
