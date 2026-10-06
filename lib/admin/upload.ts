import { randomBytes } from "crypto";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 5 * 1024 * 1024;

export async function saveUploadedImage(
  file: File,
  folder = "general"
): Promise<{ url: string; mimeType: string; sizeBytes: number; filename: string }> {
  if (!ALLOWED.has(file.type)) {
    throw new Error("Only JPEG, PNG, WebP or GIF images are allowed");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be 5MB or smaller");
  }

  const safeFolder = folder.replace(/[^a-z0-9_-]/gi, "").slice(0, 40) || "general";
  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : file.type === "image/gif"
          ? "gif"
          : "jpg";
  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", safeFolder);
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  return {
    url: `/uploads/${safeFolder}/${filename}`,
    mimeType: file.type,
    sizeBytes: file.size,
    filename,
  };
}

export async function deleteLocalUpload(url: string) {
  if (!url.startsWith("/uploads/")) return;
  const relative = url.replace(/^\//, "");
  const full = path.join(process.cwd(), "public", relative);
  const uploadsRoot = path.join(process.cwd(), "public", "uploads");
  if (!full.startsWith(uploadsRoot)) return;
  try {
    await unlink(full);
  } catch {
    /* already gone */
  }
}
