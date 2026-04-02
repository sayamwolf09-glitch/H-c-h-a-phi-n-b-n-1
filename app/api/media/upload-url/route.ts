import { randomUUID } from "node:crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { requireRole } from "@/lib/rbac/guard";
import { ROLE_ADMIN, ROLE_TEACHER } from "@/lib/rbac/roles";
import { fail, ok } from "@/lib/utils/api-response";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getUploadLimits } from "@/lib/config/env";

const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? ""
  }
});

export async function POST(request: Request) {
  const guard = await requireRole([ROLE_ADMIN, ROLE_TEACHER]);
  if ("error" in guard) return guard.error;
  const limit = checkRateLimit({
    key: `media-upload-url:${guard.session.user.id}`,
    windowMs: 60_000,
    max: 30
  });
  if (!limit.allowed) return fail("Quá nhiều yêu cầu upload, vui lòng thử lại sau.", 429);

  const body = await request.json();
  const mimeType = String(body.mimeType ?? "");
  const fileName = String(body.fileName ?? "upload.bin");
  const sizeBytes = Number(body.sizeBytes ?? 0);

  if (!mimeType) return fail("Thiếu mimeType", 422);
  const isAllowedMime =
    mimeType.startsWith("image/") || mimeType.startsWith("video/") || mimeType.startsWith("audio/");
  if (!isAllowedMime) return fail("Định dạng file không được phép", 422);
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) return fail("Thiếu hoặc sai dung lượng file", 422);
  const limits = getUploadLimits();
  if (mimeType.startsWith("image/") && sizeBytes > limits.image) {
    return fail("Ảnh vượt quá dung lượng cho phép", 422);
  }
  if (mimeType.startsWith("video/") && sizeBytes > limits.video) {
    return fail("Video vượt quá dung lượng cho phép", 422);
  }
  if (mimeType.startsWith("audio/") && sizeBytes > limits.audio) {
    return fail("Âm thanh vượt quá dung lượng cho phép", 422);
  }

  const objectKey = `${Date.now()}-${randomUUID()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: objectKey,
    ContentType: mimeType
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  const publicUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${objectKey}`;

  return ok({ uploadUrl, objectKey, publicUrl });
}
