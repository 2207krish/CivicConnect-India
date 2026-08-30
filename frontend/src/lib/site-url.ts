export function siteUrl(): string {
  let configured = process.env.APP_URL?.trim().replace(/\/$/, "");
  if (!configured) {
    return "http://localhost:3000";
  }

  // Ensure protocol is present even if user entered "www.domain.com"
  if (!/^https?:\/\//i.test(configured)) {
    configured = `https://${configured}`;
  }

  try {
    const url = new URL(configured);
    return url.origin;
  } catch {
    return "http://localhost:3000";
  }
}
