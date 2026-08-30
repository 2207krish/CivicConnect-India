import { NextResponse } from "next/server";

/**
 * Maximum request body sizes by route type (bytes).
 */
const DEFAULT_LIMIT = 1 * 1024 * 1024; // 1 MB
const PHOTO_LIMIT = 6 * 1024 * 1024; // 6 MB (for complaint photos)

/**
 * Read and parse a JSON request body, enforcing a byte-size limit.
 * Returns `{ data, error }` — if error is set, return it directly.
 */
export async function safeJsonBody<T = unknown>(
  request: Request,
  opts?: { maxBytes?: number }
): Promise<{ data: T; error?: never } | { data?: never; error: NextResponse }> {
  const limit = opts?.maxBytes ?? DEFAULT_LIMIT;

  // Content-Length pre-check (not always present, but a fast early reject)
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > limit) {
    return {
      error: NextResponse.json(
        { error: `Request body too large. Maximum ${formatBytes(limit)}.` },
        { status: 413 }
      ),
    };
  }

  try {
    const text = await request.text();
    if (text.length > limit) {
      return {
        error: NextResponse.json(
          { error: `Request body too large. Maximum ${formatBytes(limit)}.` },
          { status: 413 }
        ),
      };
    }
    const data = JSON.parse(text) as T;
    return { data };
  } catch {
    return {
      error: NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      ),
    };
  }
}

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} bytes`;
}

export { DEFAULT_LIMIT, PHOTO_LIMIT };
