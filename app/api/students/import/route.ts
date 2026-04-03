import { requireRole, requireTeacherClassAccess } from "@/lib/rbac/guard";
import { ROLE_ADMIN, ROLE_TEACHER } from "@/lib/rbac/roles";
import { fail, ok } from "@/lib/utils/api-response";
import { importStudentsFromExcel } from "@/lib/services/excel-import.service";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { writeAuditLog } from "@/lib/services/audit-log.service";

export async function POST(request: Request) {
  const guard = await requireRole([ROLE_ADMIN, ROLE_TEACHER]);
  if ("error" in guard) return guard.error;
  const rate = checkRateLimit({
    key: `student-import:${guard.session.user.id}`,
    windowMs: 60_000,
    max: 10
  });
  if (!rate.allowed) return fail("Bạn thao tác quá nhanh, vui lòng thử lại sau.", 429);

  const formData = await request.formData();
  const classRoomId = String(formData.get("classRoomId") ?? "");
  const file = formData.get("file");

  if (!classRoomId) return fail("Thiếu classRoomId", 422);
  if (!(file instanceof File)) return fail("Thiếu file Excel", 422);
  const classGuard = await requireTeacherClassAccess(classRoomId);
  if ("error" in classGuard) return classGuard.error;
  if (!file.name.match(/\.(xlsx|xls)$/i)) return fail("File không đúng định dạng Excel", 422);
  if (file.size > 5 * 1024 * 1024) return fail("File Excel vượt quá 5MB", 422);

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await importStudentsFromExcel({
    classRoomId,
    fileBuffer: buffer,
    createdById: guard.session.user.id,
    sourceFileName: file.name
  });

  await writeAuditLog({
    actorUserId: guard.session.user.id,
    action: "STUDENT_IMPORT",
    entityType: "CLASSROOM",
    entityId: classRoomId,
    metadata: {
      sourceFileName: file.name,
      totalRows: result.totalRows,
      successRows: result.successRows,
      failedRows: result.failedRows
    }
  });

  return ok(result, { status: 201 });
}
