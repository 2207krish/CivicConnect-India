import { mkdir, readFile, writeFile } from "fs/promises";
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

export async function readStore<T>(fileName: string, fallback: T): Promise<T> {
  return withLock(async () => {
    await ensureDir();
    try {
      const raw = await readFile(dataPath(fileName), "utf8");
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  });
}

export async function writeStore<T>(fileName: string, value: T) {
  return withLock(async () => {
    await ensureDir();
    await writeFile(dataPath(fileName), JSON.stringify(value, null, 2), "utf8");
  });
}

export async function updateStore<T>(
  fileName: string,
  fallback: T,
  updater: (current: T) => T | Promise<T>
) {
  return withLock(async () => {
    await ensureDir();
    let current = fallback;
    try {
      const raw = await readFile(dataPath(fileName), "utf8");
      current = JSON.parse(raw) as T;
    } catch {
      current = fallback;
    }
    const next = await updater(current);
    await writeFile(dataPath(fileName), JSON.stringify(next, null, 2), "utf8");
    return next;
  });
}
