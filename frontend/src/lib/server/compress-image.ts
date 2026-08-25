import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { dataPath } from "@/lib/server/data-store";
import type { ComplaintPhoto } from "@/types";

export const MAX_PHOTO_BYTES = 200 * 1024;
export const MAX_PHOTOS = 3;
const MAX_EDGE = 1600;
const MAX_INPUT_BYTES = 6 * 1024 * 1024;

function photosDir() {
  return dataPath("photos");
}

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.trim().match(/^data:image\/[a-zA-Z0-9.+-]+;base64,([A-Za-z0-9+/]+={0,2})$/);
  if (!match) throw new Error("Each photo must be a valid image.");
  const buffer = Buffer.from(match[1], "base64");
  if (buffer.length > MAX_INPUT_BYTES) {
    throw new Error("A photo is too large to process. Compress it under 200 KB and try again.");
  }
  return buffer;
}

async function jpegUnderLimit(input: Buffer) {
  let width = MAX_EDGE;
  let quality = 80;
  let output = await sharp(input)
    .rotate()
    .resize({ width, height: width, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();

  while (output.length > MAX_PHOTO_BYTES && quality > 38) {
    quality -= 8;
    output = await sharp(input)
      .rotate()
      .resize({ width, height: width, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
  }

  while (output.length > MAX_PHOTO_BYTES && width > 640) {
    width = Math.round(width * 0.82);
    output = await sharp(input)
      .rotate()
      .resize({ width, height: width, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
  }

  if (output.length > MAX_PHOTO_BYTES) {
    throw new Error("A photo could not be compressed under 200 KB.");
  }

  return output;
}

export async function saveCompressedPhotos(
  incoming: { name?: string; dataUrl?: string }[] | undefined
): Promise<ComplaintPhoto[]> {
  if (!incoming?.length) return [];
  const selected = incoming.slice(0, MAX_PHOTOS);
  await mkdir(photosDir(), { recursive: true });

  const saved: ComplaintPhoto[] = [];
  for (const item of selected) {
    if (!item.dataUrl) continue;
    const jpeg = await jpegUnderLimit(parseDataUrl(item.dataUrl));
    const id = crypto.randomUUID();
    const fileName = `${id}.jpg`;
    await writeFile(path.join(photosDir(), fileName), jpeg);
    const original = (item.name || "photo").replace(/[^\w.\-]+/g, "_");
    saved.push({
      name: original.toLowerCase().endsWith(".jpg") ? original : `${original}.jpg`,
      url: `/api/photos/${fileName}`,
      bytes: jpeg.length,
    });
  }
  return saved;
}

export function photoFilePath(fileName: string) {
  if (!/^[0-9a-f-]{36}\.jpg$/i.test(fileName)) return null;
  return path.join(photosDir(), fileName);
}
