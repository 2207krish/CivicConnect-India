import { updateStore } from "@/lib/server/data-store";
import { sendMail, isSmtpConfigured } from "@/lib/server/mailer";
import { siteConfig } from "@/config/site";

const FILE = "feedback.json";

export type FeedbackTopic = "bug" | "modification" | "development" | "other";

export interface FeedbackEntry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  topic: FeedbackTopic;
  message: string;
  createdAt: string;
}

export async function saveFeedback(input: Omit<FeedbackEntry, "id" | "createdAt">) {
  const entry: FeedbackEntry = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  await updateStore<FeedbackEntry[]>(FILE, [], (items) => [entry, ...items].slice(0, 500));

  let emailed = false;
  if (isSmtpConfigured()) {
    const topicLabel = {
      bug: "Bug report",
      modification: "Modification request",
      development: "Development change",
      other: "General feedback",
    }[input.topic];

    await sendMail({
      to: siteConfig.developer.email,
      subject: `[CivicConnect feedback] ${topicLabel} from ${input.name}`,
      text: [
        `Topic: ${topicLabel}`,
        `Name: ${input.name}`,
        `Email: ${input.email}`,
        input.phone ? `Phone: ${input.phone}` : null,
        ``,
        input.message,
      ]
        .filter(Boolean)
        .join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#0f172a">
          <h2 style="color:#c45c14">CivicConnect India feedback</h2>
          <p><strong>Topic:</strong> ${topicLabel}</p>
          <p><strong>Name:</strong> ${input.name}</p>
          <p><strong>Email:</strong> ${input.email}</p>
          ${input.phone ? `<p><strong>Phone:</strong> ${input.phone}</p>` : ""}
          <p style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px">${input.message}</p>
        </div>
      `,
    });
    emailed = true;
  }

  return { entry, emailed };
}
