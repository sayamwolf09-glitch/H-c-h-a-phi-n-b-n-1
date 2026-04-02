import { MediaKind } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/rbac/guard";
import { fail, ok } from "@/lib/utils/api-response";

export async function POST(request: Request) {
  const guard = await requireAuth();
  if ("error" in guard) return guard.error;

  const body = await request.json();
  const objectKey = String(body.objectKey ?? "");
  const url = String(body.url ?? "");
  const mimeType = String(body.mimeType ?? "application/octet-stream");
  const sizeBytes = BigInt(body.sizeBytes ?? 0);
  const kind = String(body.kind ?? "DOCUMENT") as MediaKind;

  if (!objectKey || !url) return fail("Thiếu objectKey hoặc url", 422);

  const media = await prisma.mediaAsset.create({
    data: {
      ownerUserId: guard.session.user.id,
      bucket: process.env.S3_BUCKET ?? "chemplay-media",
      objectKey,
      url,
      mimeType,
      sizeBytes,
      kind
    }
  });

  return ok(media, { status: 201 });
}
