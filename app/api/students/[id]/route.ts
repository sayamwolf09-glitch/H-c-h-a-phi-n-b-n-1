import { prisma } from "@/lib/db/prisma";
import { requireRole, requireTeacherClassAccess } from "@/lib/rbac/guard";
import { ROLE_ADMIN, ROLE_TEACHER } from "@/lib/rbac/roles";
import { ok, fail } from "@/lib/utils/api-response";
import { studentUpdateSchema } from "@/lib/validations/student";

function normalizeName(fullName: string): string {
  return fullName.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const guard = await requireRole([ROLE_ADMIN, ROLE_TEACHER]);
  if ("error" in guard) return guard.error;

  const existing = await prisma.student.findUnique({ where: { id: params.id } });
  if (!existing) return fail("Không tìm thấy học sinh", 404);

  const classGuard = await requireTeacherClassAccess(existing.classRoomId);
  if ("error" in classGuard) return classGuard.error;

  const payload = await request.json();
  const parsed = studentUpdateSchema.safeParse({ ...payload, id: params.id });
  if (!parsed.success) return fail("Dữ liệu cập nhật học sinh không hợp lệ", 422, parsed.error.flatten());

  const nextFullName = parsed.data.fullName ?? existing.fullName;
  const updated = await prisma.student.update({
    where: { id: params.id },
    data: {
      fullName: parsed.data.fullName,
      normalizedFullName: normalizeName(nextFullName),
      studentCode: parsed.data.studentCode,
      isActive: parsed.data.isActive
    }
  });

  return ok(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const guard = await requireRole([ROLE_ADMIN, ROLE_TEACHER]);
  if ("error" in guard) return guard.error;

  const existing = await prisma.student.findUnique({ where: { id: params.id } });
  if (!existing) return fail("Không tìm thấy học sinh", 404);

  const classGuard = await requireTeacherClassAccess(existing.classRoomId);
  if ("error" in classGuard) return classGuard.error;

  await prisma.student.update({ where: { id: params.id }, data: { isActive: false } });
  return ok({ id: params.id, deleted: true });
}
