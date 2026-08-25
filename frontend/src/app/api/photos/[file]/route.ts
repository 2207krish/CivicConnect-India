import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import { photoFilePath } from "@/lib/server/compress-image";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ file: string }> }
) {
  const { file } = await context.params;
  const diskPath = photoFilePath(file);
  if (!diskPath) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }
  try {
    const body = await readFile(diskPath);
    return new NextResponse(Uint8Array.from(body), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }
}
