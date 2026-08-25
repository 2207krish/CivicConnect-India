export function siteUrl() {
  const configured = process.env.APP_URL?.trim().replace(/\/$/, "");
  return configured || "http://localhost:3000";
}
