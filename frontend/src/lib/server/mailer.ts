import nodemailer from "nodemailer";

interface SendMailInput {
  to: string;
  subject: string;
  text: string;
  html: string;
}

function smtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim()
  );
}

function smtpErrorMessage(error: unknown) {
  const raw = error instanceof Error ? error.message : "SMTP send failed.";
  if (/invalid login|eauth|username and password/i.test(raw)) {
    return "Gmail rejected the SMTP login. Use a 16-character App Password, not your normal Gmail password.";
  }
  if (/self signed|certificate/i.test(raw)) {
    return "SMTP TLS certificate was rejected. Check SMTP_HOST and SMTP_PORT.";
  }
  if (/connection timeout|econnrefused|enotfound/i.test(raw)) {
    return "Could not reach the SMTP server. Check SMTP_HOST, SMTP_PORT, and your internet connection.";
  }
  return raw;
}

function createSmtpTransport() {
  if (!smtpConfigured()) {
    throw new Error(
      "SMTP_USER and SMTP_PASS are still empty in frontend/.env.local. Put your Gmail address and a 16-character Google App Password there, save the file, and restart the site."
    );
  }

  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendMail(input: SendMailInput) {
  const transporter = createSmtpTransport();
  const from =
    process.env.SMTP_FROM ||
    `CivicConnect India <${process.env.SMTP_USER}>`;

  try {
    await transporter.sendMail({
      from,
      to: input.to,
      replyTo: process.env.SMTP_USER,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
  } catch (error) {
    throw new Error(smtpErrorMessage(error));
  }

  return {
    previewUrl: null,
    delivery: "smtp" as const,
  };
}

export function isSmtpConfigured() {
  return smtpConfigured();
}

export function appUrl(request?: Request) {
  const configured = process.env.APP_URL?.trim().replace(/\/$/, "");
  return configured || request?.headers.get("origin") || "http://localhost:3000";
}
