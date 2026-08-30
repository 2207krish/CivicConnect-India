import { generateOtp, safeEqual, sha256 } from "@/lib/server/crypto";
import { updateStore } from "@/lib/server/data-store";
import { sendMail } from "@/lib/server/mailer";
import { saveOutboxMessage } from "@/lib/server/outbox";

const FILE = "login-otps.json";
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const RESEND_INTERVAL_MS = 30 * 1000; // 30 seconds
const MAX_ATTEMPTS = 5;

interface LoginOtpRecord {
  email: string;
  otpHash: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

interface LoginOtpStore {
  records: LoginOtpRecord[];
}

const emptyStore: LoginOtpStore = { records: [] };

function composeLoginEmail(name: string, otp: string) {
  const text = [
    `Hello ${name},`,
    ``,
    `Use this one-time password (OTP) to securely log in to your CivicConnect India account:`,
    ``,
    `Login OTP: ${otp}`,
    ``,
    `This code is valid for 10 minutes. If you did not request this login code, please reset your password immediately.`,
    ``,
    `— CivicConnect India Security Desk`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#0f172a;padding:24px;border:1px solid #e2e8f0;border-radius:16px;background:#ffffff">
      <div style="text-align:center;margin-bottom:20px">
        <h2 style="color:#0f172a;margin:0;font-size:22px">CivicConnect <span style="color:#d97706">India</span></h2>
        <p style="color:#64748b;font-size:12px;margin:4px 0 0 0;text-transform:uppercase;letter-spacing:1.5px">Citizen Authentication</p>
      </div>
      <p style="font-size:15px;line-height:1.6">Hello <strong>${name}</strong>,</p>
      <p style="font-size:14px;color:#334155;line-height:1.6">Enter this one-time code to complete your secure sign-in:</p>
      <div style="margin:24px 0;text-align:center">
        <div style="font-size:34px;letter-spacing:10px;font-weight:800;background:#fef3c7;color:#78350f;border:1.5px dashed #f59e0b;border-radius:12px;padding:16px 12px;display:inline-block;min-width:240px">
          ${otp}
        </div>
      </div>
      <p style="color:#64748b;font-size:13px;line-height:1.5;text-align:center">
        Valid for <strong>10 minutes</strong>. Never share this code with anyone.
      </p>
      <hr style="border:none;border-top:1px solid #f1f5f9;margin:24px 0" />
      <p style="color:#94a3b8;font-size:12px;margin:0;text-align:center">
        If you did not attempt to sign in, someone may know your password. Change it immediately.
      </p>
    </div>
  `;

  return { text, html };
}

export async function issueLoginOtp(email: string, name: string) {
  const normalized = email.trim().toLowerCase();
  const now = Date.now();

  // Check rate limit on resends
  const existing = (await updateStore<LoginOtpStore>(FILE, emptyStore, (s) => s))
    .records.find((r) => r.email === normalized);

  if (existing && now - existing.lastSentAt < RESEND_INTERVAL_MS) {
    const wait = Math.ceil((RESEND_INTERVAL_MS - (now - existing.lastSentAt)) / 1000);
    throw new Error(`Please wait ${wait} seconds before requesting another login OTP.`);
  }

  const otp = generateOtp();
  const record: LoginOtpRecord = {
    email: normalized,
    otpHash: sha256(otp),
    expiresAt: now + OTP_TTL_MS,
    attempts: 0,
    lastSentAt: now,
  };

  await updateStore<LoginOtpStore>(FILE, emptyStore, (store) => ({
    records: [
      ...store.records.filter((r) => r.email !== normalized),
      record,
    ],
  }));

  const content = composeLoginEmail(name || "Citizen", otp);
  const subject = `${otp} is your CivicConnect login OTP`;

  try {
    const delivery = await sendMail({
      to: normalized,
      subject,
      text: content.text,
      html: content.html,
    });

    await saveOutboxMessage({
      to: normalized,
      subject,
      text: content.text,
      html: content.html,
      otp,
      verifyUrl: null,
      previewUrl: delivery.previewUrl,
      sentAt: new Date().toISOString(),
      delivery: delivery.delivery,
    });

    return { ok: true, email: normalized };
  } catch (error) {
    // If sending fails, clean up record
    await updateStore<LoginOtpStore>(FILE, emptyStore, (store) => ({
      records: store.records.filter((r) => r.email !== normalized),
    }));
    throw error;
  }
}

export async function verifyLoginOtp(email: string, otp: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  let valid = false;
  let errorMessage = "Invalid or expired login OTP.";

  await updateStore<LoginOtpStore>(FILE, emptyStore, (store) => {
    const record = store.records.find((r) => r.email === normalized);
    if (!record) {
      errorMessage = "No login OTP was found. Please request a new code.";
      return store;
    }

    if (record.expiresAt < Date.now()) {
      errorMessage = "This login OTP has expired. Please log in again.";
      return {
        records: store.records.filter((r) => r.email !== normalized),
      };
    }

    if (record.attempts >= MAX_ATTEMPTS) {
      errorMessage = "Too many incorrect attempts. Please log in again.";
      return {
        records: store.records.filter((r) => r.email !== normalized),
      };
    }

    const otpOk = safeEqual(record.otpHash, sha256(otp.trim()));
    if (!otpOk) {
      return {
        records: store.records.map((r) =>
          r.email === normalized ? { ...r, attempts: r.attempts + 1 } : r
        ),
      };
    }

    valid = true;
    // Consume on success
    return {
      records: store.records.filter((r) => r.email !== normalized),
    };
  });

  if (!valid) {
    throw new Error(errorMessage);
  }

  return true;
}
