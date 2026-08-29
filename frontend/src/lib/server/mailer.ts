import { Resend } from "resend";

interface SendMailInput {
  to: string;
  subject: string;
  text: string;
  html: string;
}

function resendConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function getResend() {
  if (!resendConfigured()) {
    throw new Error(
      "RESEND_API_KEY is not set. Add it to your .env.local (or Railway environment variables) to enable email sending."
    );
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendMail(input: SendMailInput) {
  const resend = getResend();
  const from =
    process.env.RESEND_FROM ||
    "CivicConnect India <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return {
    previewUrl: null,
    delivery: "smtp" as const,
  };
}

export function isSmtpConfigured() {
  return resendConfigured();
}

export function appUrl(request?: Request) {
  const configured = process.env.APP_URL?.trim().replace(/\/$/, "");
  return configured || request?.headers.get("origin") || "http://localhost:3000";
}
