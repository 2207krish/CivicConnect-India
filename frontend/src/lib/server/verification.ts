import { generateOtp, generateToken, safeEqual, sha256 } from "@/lib/server/crypto";
import { updateStore } from "@/lib/server/data-store";
import { appUrl, sendMail } from "@/lib/server/mailer";
import { saveOutboxMessage } from "@/lib/server/outbox";

const FILE = "verifications.json";
const OTP_TTL_MS = 15 * 60 * 1000;
const RESEND_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;
const IP_LIMIT = 10;
const IP_WINDOW_MS = 60 * 60 * 1000;

interface VerificationRecord {
  email: string;
  otpHash: string;
  linkTokenHash: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

interface VerificationStore {
  records: VerificationRecord[];
  sends: { ip: string; at: number }[];
}

const emptyStore: VerificationStore = { records: [], sends: [] };

function composeEmail(name: string, otp: string, verifyUrl: string) {
  const text = [
    `Hello ${name},`,
    ``,
    `Use this CivicConnect India verification token to finish creating your account:`,
    ``,
    `Token: ${otp}`,
    ``,
    `Or open this link (valid for 15 minutes):`,
    verifyUrl,
    ``,
    `If you did not register on CivicConnect India, ignore this email.`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#0f172a">
      <h2 style="color:#2563eb;margin-bottom:8px">CivicConnect India</h2>
      <p>Hello ${name},</p>
      <p>Enter this one-time token to verify your email and activate your citizen account.</p>
      <p style="font-size:32px;letter-spacing:8px;font-weight:700;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 12px;text-align:center">${otp}</p>
      <p style="text-align:center;margin:24px 0">
        <a href="${verifyUrl}" style="background:#2563eb;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;display:inline-block">Verify email</a>
      </p>
      <p style="color:#64748b;font-size:13px">This token expires in 15 minutes. If you did not register, you can ignore this message.</p>
    </div>
  `;

  return { text, html };
}

export async function issueVerificationEmail(
  email: string,
  name: string,
  request: Request,
  ip: string
) {
  const normalized = email.trim().toLowerCase();
  const now = Date.now();

  await updateStore<VerificationStore>(FILE, emptyStore, (store) => {
    const recent = store.sends.filter((item) => now - item.at < IP_WINDOW_MS);
    if (recent.filter((item) => item.ip === ip).length >= IP_LIMIT) {
      throw new Error("Too many verification emails from this network. Try again later.");
    }
    return { ...store, sends: [...recent, { ip, at: now }] };
  });

  const existing = (await updateStore<VerificationStore>(FILE, emptyStore, (store) => store))
    .records.find((item) => item.email === normalized);

  if (existing && now - existing.lastSentAt < RESEND_MS) {
    const wait = Math.ceil((RESEND_MS - (now - existing.lastSentAt)) / 1000);
    throw new Error(`Please wait ${wait} seconds before requesting another token.`);
  }

  const otp = generateOtp();
  const linkToken = generateToken();
  const record: VerificationRecord = {
    email: normalized,
    otpHash: sha256(otp),
    linkTokenHash: sha256(linkToken),
    expiresAt: now + OTP_TTL_MS,
    attempts: 0,
    lastSentAt: now,
  };

  await updateStore<VerificationStore>(FILE, emptyStore, (store) => ({
    ...store,
    records: [
      ...store.records.filter((item) => item.email !== normalized),
      record,
    ],
  }));

  const verifyUrl = `${appUrl(request)}/verify-email?email=${encodeURIComponent(normalized)}&token=${linkToken}`;
  const content = composeEmail(name || "Citizen", otp, verifyUrl);
  const subject = `${otp} is your CivicConnect verification token`;
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
      verifyUrl,
      previewUrl: delivery.previewUrl,
      sentAt: new Date().toISOString(),
      delivery: delivery.delivery,
    });
    return delivery;
  } catch (error) {
    await updateStore<VerificationStore>(FILE, emptyStore, (store) => ({
      ...store,
      records: store.records.filter((item) => item.email !== normalized),
    }));
    throw error instanceof Error
      ? error
      : new Error("The verification email could not be sent.");
  }
}

export async function consumeVerification(input: {
  email: string;
  otp?: string;
  token?: string;
}) {
  const email = input.email.trim().toLowerCase();
  let accepted = false;
  let error = "Invalid or expired verification token.";

  await updateStore<VerificationStore>(FILE, emptyStore, (store) => {
    const record = store.records.find((item) => item.email === email);
    if (!record) {
      error = "No verification token was found. Request a new one.";
      return store;
    }
    if (record.expiresAt < Date.now()) {
      error = "This token has expired. Request a new one.";
      return {
        ...store,
        records: store.records.filter((item) => item.email !== email),
      };
    }
    if (record.attempts >= MAX_ATTEMPTS) {
      error = "Too many incorrect attempts. Request a new token.";
      return {
        ...store,
        records: store.records.filter((item) => item.email !== email),
      };
    }

    const otpOk = input.otp ? safeEqual(record.otpHash, sha256(input.otp)) : false;
    const linkOk = input.token
      ? safeEqual(record.linkTokenHash, sha256(input.token))
      : false;

    if (!otpOk && !linkOk) {
      return {
        ...store,
        records: store.records.map((item) =>
          item.email === email ? { ...item, attempts: item.attempts + 1 } : item
        ),
      };
    }

    accepted = true;
    return {
      ...store,
      records: store.records.filter((item) => item.email !== email),
    };
  });

  if (!accepted) {
    throw new Error(error);
  }
}

export function clientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}
