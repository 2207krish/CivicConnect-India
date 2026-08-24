import { generateOtp, generateToken, safeEqual, sha256 } from "@/lib/server/crypto";
import { updateStore } from "@/lib/server/data-store";
import { appUrl, sendMail } from "@/lib/server/mailer";
import { findUserByEmail } from "@/lib/server/users";

const FILE = "password-resets.json";
const OTP_TTL_MS = 15 * 60 * 1000;
const RESEND_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

interface ResetRecord {
  email: string;
  otpHash: string;
  linkTokenHash: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

const empty: ResetRecord[] = [];

function composeResetEmail(name: string, otp: string, resetUrl: string) {
  const text = [
    `Hello ${name},`,
    ``,
    `Use this CivicConnect India token to set a new password:`,
    ``,
    `Token: ${otp}`,
    ``,
    `Or open this link (valid for 15 minutes):`,
    resetUrl,
    ``,
    `If you did not ask to reset your password, ignore this email.`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#0f172a">
      <h2 style="color:#c45c14;margin-bottom:8px">CivicConnect India</h2>
      <p>Hello ${name},</p>
      <p>Enter this one-time token to choose a new password for your citizen account.</p>
      <p style="font-size:32px;letter-spacing:8px;font-weight:700;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 12px;text-align:center">${otp}</p>
      <p style="text-align:center;margin:24px 0">
        <a href="${resetUrl}" style="background:#c45c14;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;display:inline-block">Reset password</a>
      </p>
      <p style="color:#64748b;font-size:13px">This token expires in 15 minutes.</p>
    </div>
  `;

  return { text, html };
}

export async function issuePasswordReset(email: string, request: Request) {
  const normalized = email.trim().toLowerCase();
  const user = await findUserByEmail(normalized);
  if (!user) {
    return { sent: false as const };
  }

  const now = Date.now();
  const existing = (await updateStore<ResetRecord[]>(FILE, empty, (records) => records)).find(
    (item) => item.email === normalized
  );
  if (existing && now - existing.lastSentAt < RESEND_MS) {
    const wait = Math.ceil((RESEND_MS - (now - existing.lastSentAt)) / 1000);
    throw new Error(`Please wait ${wait} seconds before requesting another reset token.`);
  }

  const otp = generateOtp();
  const linkToken = generateToken();
  await updateStore<ResetRecord[]>(FILE, empty, (records) => [
    ...records.filter((item) => item.email !== normalized),
    {
      email: normalized,
      otpHash: sha256(otp),
      linkTokenHash: sha256(linkToken),
      expiresAt: now + OTP_TTL_MS,
      attempts: 0,
      lastSentAt: now,
    },
  ]);

  const resetUrl = `${appUrl(request)}/reset-password?email=${encodeURIComponent(normalized)}&token=${linkToken}`;
  const content = composeResetEmail(user.name || "Citizen", otp, resetUrl);
  await sendMail({
    to: normalized,
    subject: `${otp} is your CivicConnect password reset token`,
    text: content.text,
    html: content.html,
  });

  return { sent: true as const };
}

export async function consumePasswordReset(input: {
  email: string;
  otp?: string;
  token?: string;
}) {
  const email = input.email.trim().toLowerCase();
  let accepted = false;
  let error = "Invalid or expired reset token.";

  await updateStore<ResetRecord[]>(FILE, empty, (records) => {
    const record = records.find((item) => item.email === email);
    if (!record) {
      error = "No reset token was found. Request a new one.";
      return records;
    }
    if (record.expiresAt < Date.now()) {
      error = "This reset token has expired. Request a new one.";
      return records.filter((item) => item.email !== email);
    }
    if (record.attempts >= MAX_ATTEMPTS) {
      error = "Too many incorrect attempts. Request a new reset token.";
      return records.filter((item) => item.email !== email);
    }

    const otpOk = input.otp ? safeEqual(record.otpHash, sha256(input.otp)) : false;
    const linkOk = input.token ? safeEqual(record.linkTokenHash, sha256(input.token)) : false;
    if (!otpOk && !linkOk) {
      return records.map((item) =>
        item.email === email ? { ...item, attempts: item.attempts + 1 } : item
      );
    }

    accepted = true;
    return records.filter((item) => item.email !== email);
  });

  if (!accepted) {
    throw new Error(error);
  }
}
