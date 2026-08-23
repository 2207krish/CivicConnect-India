import { getSessionToken } from "@/lib/server/cookies";
import { getSessionUserId } from "@/lib/server/sessions";
import { asPublicUser, findUserById } from "@/lib/server/users";

export async function getCurrentUser() {
  const token = await getSessionToken();
  const userId = await getSessionUserId(token);
  if (!userId) return null;
  const user = await findUserById(userId);
  if (!user || !user.emailVerified) return null;
  return asPublicUser(user);
}
