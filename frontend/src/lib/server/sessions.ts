import { generateToken } from "@/lib/server/crypto";
import { updateStore } from "@/lib/server/data-store";

const FILE = "sessions.json";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

interface SessionRecord {
  token: string;
  userId: string;
  expiresAt: number;
}

async function mutateSessions(
  updater: (sessions: SessionRecord[]) => SessionRecord[]
) {
  return updateStore<SessionRecord[]>(FILE, [], (sessions) => {
    const live = sessions.filter((session) => session.expiresAt > Date.now());
    return updater(live);
  });
}

export async function createSession(userId: string) {
  const token = generateToken();
  await mutateSessions((sessions) => [
    ...sessions.filter((session) => session.userId !== userId),
    { token, userId, expiresAt: Date.now() + SESSION_MS },
  ]);
  return token;
}

export async function getSessionUserId(token: string | undefined) {
  if (!token) return null;
  let userId: string | null = null;
  await mutateSessions((sessions) => {
    const match = sessions.find((session) => session.token === token);
    userId = match?.userId ?? null;
    return sessions;
  });
  return userId;
}

export async function deleteSession(token: string | undefined) {
  if (!token) return;
  await mutateSessions((sessions) =>
    sessions.filter((session) => session.token !== token)
  );
}
