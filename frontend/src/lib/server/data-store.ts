import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";

const dataDir = path.join(process.cwd(), ".data");
let queue: Promise<unknown> = Promise.resolve();

function withLock<T>(work: () => Promise<T>) {
  const run = queue.then(work, work);
  queue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

async function ensureDir() {
  await mkdir(dataDir, { recursive: true });
}

export function dataPath(fileName: string) {
  return path.join(dataDir, fileName);
}

/**
 * Atomically write JSON data — writes to a `.tmp` file first, then renames.
 * Prevents corruption if the process crashes mid-write.
 */
async function atomicWriteJson<T>(fileName: string, value: T) {
  const target = dataPath(fileName);
  const tmp = `${target}.tmp`;
  const backup = `${target}.bak`;
  const json = JSON.stringify(value, null, 2);

  // Write to temp file first
  await writeFile(tmp, json, "utf8");

  // Keep a backup of the previous good copy
  try {
    await readFile(target, "utf8"); // only backup if existing file is readable
    await rename(target, backup);
  } catch {
    // No previous file to backup — that's fine
  }

  // Atomic rename
  await rename(tmp, target);
}

export async function readStore<T>(fileName: string, fallback: T): Promise<T> {
  return withLock(async () => {
    await ensureDir();
    const target = dataPath(fileName);
    try {
      const raw = await readFile(target, "utf8");
      const parsed = JSON.parse(raw) as T;
      return parsed;
    } catch {
      // Try the backup file if the main file is corrupted / missing
      try {
        const backup = `${target}.bak`;
        const raw = await readFile(backup, "utf8");
        const parsed = JSON.parse(raw) as T;
        // Restore the backup as the main file
        await writeFile(target, JSON.stringify(parsed, null, 2), "utf8");
        console.warn(`[data-store] Restored ${fileName} from backup.`);
        return parsed;
      } catch {
        return fallback;
      }
    }
  });
}

export async function writeStore<T>(fileName: string, value: T) {
  return withLock(async () => {
    await ensureDir();
    await atomicWriteJson(fileName, value);
  });
}

export async function updateStore<T>(
  fileName: string,
  fallback: T,
  updater: (current: T) => T | Promise<T>
) {
  return withLock(async () => {
    await ensureDir();
    const target = dataPath(fileName);
    let current = fallback;
    try {
      const raw = await readFile(target, "utf8");
      current = JSON.parse(raw) as T;
    } catch {
      // Try backup on corruption
      try {
        const backup = `${target}.bak`;
        const raw = await readFile(backup, "utf8");
        current = JSON.parse(raw) as T;
        console.warn(`[data-store] Restored ${fileName} from backup for update.`);
      } catch {
        current = fallback;
      }
    }
    const next = await updater(current);
    await atomicWriteJson(fileName, next);
    return next;
  });
}
