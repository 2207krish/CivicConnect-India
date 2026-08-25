export const MAX_PHOTO_BYTES = 200 * 1024;
export const MAX_PHOTOS = 3;
export const MAX_PHOTO_EDGE = 1600;

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function drawToCanvas(source: CanvasImageSource, width: number, height: number, quality: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not compress this photo.");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(source, 0, 0, width, height);
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error("Could not compress this photo."));
        else resolve(blob);
      },
      "image/jpeg",
      quality
    );
  });
}

export async function compressImageFile(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files can be attached.");
  }

  const bitmap = await createImageBitmap(file);
  let width = bitmap.width;
  let height = bitmap.height;
  const scale = Math.min(1, MAX_PHOTO_EDGE / Math.max(width, height));
  width = Math.max(1, Math.round(width * scale));
  height = Math.max(1, Math.round(height * scale));

  let quality = 0.82;
  let blob = await drawToCanvas(bitmap, width, height, quality);

  while (blob.size > MAX_PHOTO_BYTES && quality > 0.38) {
    quality -= 0.08;
    blob = await drawToCanvas(bitmap, width, height, quality);
  }

  while (blob.size > MAX_PHOTO_BYTES && Math.max(width, height) > 640) {
    width = Math.max(1, Math.round(width * 0.82));
    height = Math.max(1, Math.round(height * 0.82));
    blob = await drawToCanvas(bitmap, width, height, quality);
  }

  bitmap.close();

  if (blob.size > MAX_PHOTO_BYTES) {
    throw new Error("This photo could not be compressed under 200 KB. Try another shot.");
  }

  const dataUrl = await blobToDataUrl(blob);
  const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return { name, dataUrl, bytes: blob.size };
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  return `${Math.round(bytes / 1024)} KB`;
}
