import { createSalt, hashPassword } from "@/lib/hash";
import { assignHomeCivicBodies } from "@/lib/matching";
import { updateStore } from "@/lib/server/data-store";
import type { Address, PublicUser, StoredUser } from "@/types";

const FILE = "users.json";

function toPublicUser(user: StoredUser): PublicUser {
  const { salt, passwordHash, ...publicUser } = user;
  void salt;
  void passwordHash;
  return publicUser;
}

async function mutateUsers(updater: (users: StoredUser[]) => StoredUser[] | Promise<StoredUser[]>) {
  return updateStore<StoredUser[]>(FILE, [], async (users) => {
    const seeded = users.some((user) => user.email === "citizen@demo.in")
      ? users
      : [await createDemoUser(), ...users];
    return updater(seeded);
  });
}

export async function listUsers() {
  return mutateUsers((users) => users);
}

export function asPublicUser(user: StoredUser): PublicUser {
  return toPublicUser(user);
}

export async function findUserByEmail(email: string) {
  const users = await listUsers();
  return (
    users.find((user) => user.email.toLowerCase() === email.trim().toLowerCase()) ??
    null
  );
}

export async function findUserById(id: string) {
  const users = await listUsers();
  return users.find((user) => user.id === id) ?? null;
}

export async function createUnverifiedUser(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: Address;
}) {
  const salt = createSalt();
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    address: input.address,
    nearestBodyIds: assignHomeCivicBodies(input.address).map((item) => item.body.id),
    emailVerified: false,
    createdAt: new Date().toISOString(),
    salt,
    passwordHash: await hashPassword(input.password, salt),
  };

  await mutateUsers((users) => [...users, user]);
  return toPublicUser(user);
}

export async function markUserEmailVerified(email: string) {
  let updated: StoredUser | null = null;
  await mutateUsers((users) =>
    users.map((user) => {
      if (user.email.toLowerCase() !== email.trim().toLowerCase()) {
        return user;
      }
      updated = { ...user, emailVerified: true };
      return updated;
    })
  );

  if (!updated) {
    throw new Error("No registration was found for this email.");
  }
  return toPublicUser(updated);
}

export async function updateUserPassword(email: string, password: string) {
  const salt = createSalt();
  const passwordHash = await hashPassword(password, salt);
  let updated: StoredUser | null = null;
  await mutateUsers((users) =>
    users.map((user) => {
      if (user.email.toLowerCase() !== email.trim().toLowerCase()) {
        return user;
      }
      updated = { ...user, salt, passwordHash, emailVerified: true };
      return updated;
    })
  );
  if (!updated) {
    throw new Error("No account was found for this email.");
  }
  return toPublicUser(updated);
}

export async function updateUserProfile(
  userId: string,
  patch: Partial<Pick<PublicUser, "name" | "phone" | "address" | "nearestBodyIds">>
) {
  let updated: StoredUser | null = null;
  await mutateUsers((users) =>
    users.map((user) => {
      if (user.id !== userId) return user;
      updated = { ...user, ...patch };
      return updated;
    })
  );

  if (!updated) {
    throw new Error("Account not found.");
  }
  return toPublicUser(updated);
}

async function createDemoUser(): Promise<StoredUser> {
  const address: Address = {
    line1: "14, Barakhamba Road",
    area: "Connaught Place",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110001",
  };
  const salt = "demodemo1234salt";

  return {
    id: "demo-anita-sharma",
    name: "Anita Sharma",
    email: "citizen@demo.in",
    phone: "9876543210",
    address,
    nearestBodyIds: assignHomeCivicBodies(address).map((item) => item.body.id),
    emailVerified: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    salt,
    passwordHash: await hashPassword("Demo@123", salt),
  };
}
