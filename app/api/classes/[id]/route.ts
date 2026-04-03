import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/rbac/guard";
import { ROLE_ADMIN } from "@/lib/rbac/roles";
import { ok, fail } from "@/lib/utils/api-response";
import { classroomUpdateSchema } from "@/lib/validations/classroom";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const guard = await requireRole([ROLE_ADMIN]);
  if ("error" in guard) return guard.error;

  const body = await request.json();
  const parsed = classroomUpdateSchema.safeParse(body);
  if (!parsed.success) return fail("Dữ liệu cập nhật lớp không hợp lệ", 422, parsed.error.flatten());

  const updated = await prisma.classRoom.update({
    where: { id: params.id },
    data: parsed.data
  });
  return ok(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const guard = await requireRole([ROLE_ADMIN]);
  if ("error" in guard) return guard.error;

  await prisma.classRoom.update({ where: { id: params.id }, data: { isActive: false } });
  return ok({ id: params.id, deleted: true });
}
