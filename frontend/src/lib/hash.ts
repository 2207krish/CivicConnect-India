import { pbkdf2Sync, randomBytes } from "crypto";

const PBKDF2_ITERATIONS = 100_000;
const PBKDF2_KEY_LEN = 64;
const PBKDF2_DIGEST = "sha512";
const PBKDF2_PREFIX = "pbkdf2$";

export function createSalt() {
  return randomBytes(16).toString("hex");
}

/**
 * Hash a password using PBKDF2-SHA512 with 100k iterations.
 * Returns a prefixed hash so we can distinguish it from legacy SHA-256 hashes.
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const derived = pbkdf2Sync(
    password,
    salt,
    PBKDF2_ITERATIONS,
    PBKDF2_KEY_LEN,
    PBKDF2_DIGEST
  );
  return `${PBKDF2_PREFIX}${derived.toString("hex")}`;
}

/**
 * Verify a password against a stored hash.
 * Supports both the new PBKDF2 format and the legacy SHA-256 format
 * for backward compatibility with existing accounts.
 */
export async function verifyPassword(
  password: string,
  salt: string,
  expectedHash: string
): Promise<boolean> {
  if (expectedHash.startsWith(PBKDF2_PREFIX)) {
    // New PBKDF2 hash
    const actualHash = await hashPassword(password, salt);
    return actualHash === expectedHash;
  }

  // Legacy SHA-256 hash — verify using the old method
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  const legacyHash = Array.from(new Uint8Array(buffer), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
  return legacyHash === expectedHash;
}

/**
 * Check whether a hash is using the legacy SHA-256 format.
 * Used to trigger re-hashing on login.
 */
export function isLegacyHash(hash: string): boolean {
  return !hash.startsWith(PBKDF2_PREFIX);
}
