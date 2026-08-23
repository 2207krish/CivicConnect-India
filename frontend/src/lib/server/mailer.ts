import nodemailer from "nodemailer";

interface SendMailInput {
  to: string;
  subject: string;
  text: string;
  html: string;
}

function smtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  );
}

async function createTransport() {
  if (smtpConfigured()) {
    return {
      transporter: nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_PORT === "465",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      }),
      preview: false,
    };
  }

  const testAccount = await nodemailer.createTestAccount();
  return {
    transporter: nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    }),
    preview: true,
  };
}

export async function sendMail(input: SendMailInput) {
  const { transporter, preview } = await createTransport();
  const from =
    process.env.SMTP_FROM ||
    process.env.SMTP_USER ||
    "CivicConnect India <noreply@civicconnect.in>";

  const info = await transporter.sendMail({
    from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });

  const testUrl = preview ? nodemailer.getTestMessageUrl(info) : null;

  return {
    previewUrl: typeof testUrl === "string" ? testUrl : null,
    delivery: smtpConfigured() ? ("smtp" as const) : ("preview" as const),
  };
}

export function isSmtpConfigured() {
  return smtpConfigured();
}

export function appUrl(request?: Request) {
  return (
    process.env.APP_URL ||
    request?.headers.get("origin") ||
    "http://localhost:3000"
  );
}
