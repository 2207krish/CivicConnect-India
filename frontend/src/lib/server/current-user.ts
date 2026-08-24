import { getSessionToken } from "@/lib/server/cookies";
import { getSessionUserId } from "@/lib/server/sessions";
import { asPublicUser, findUserById } from "@/lib/server/users";

export function bearerToken(request?: Request) {
  const header = request?.headers.get("authorization");
  if (!header?.toLowerCase().startsWith("bearer ")) return undefined;
  return header.slice(7).trim() || undefined;
}

export async function getRequestSessionToken(request?: Request) {
  return bearerToken(request) || (await getSessionToken());
}

export async function getCurrentUser(request?: Request) {
  const token = await getRequestSessionToken(request);
  const userId = await getSessionUserId(token);
  if (!userId) return null;
  const user = await findUserById(userId);
  if (!user || !user.emailVerified) return null;
  return asPublicUser(user);
}
