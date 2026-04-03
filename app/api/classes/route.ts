import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/rbac/guard";
import { ROLE_ADMIN, ROLE_TEACHER } from "@/lib/rbac/roles";
import { ok, fail } from "@/lib/utils/api-response";
import { classroomCreateSchema } from "@/lib/validations/classroom";

export async function GET() {
  const guard = await requireRole([ROLE_ADMIN, ROLE_TEACHER]);
  if ("error" in guard) return guard.error;

  const classes = await prisma.classRoom.findMany({
    orderBy: [{ grade: "asc" }, { name: "asc" }]
  });
  return ok(classes);
}

export async function POST(request: Request) {
  const guard = await requireRole([ROLE_ADMIN]);
  if ("error" in guard) return guard.error;

  const payload = await request.json();
  const parsed = classroomCreateSchema.safeParse(payload);
  if (!parsed.success) return fail("Dữ liệu lớp không hợp lệ", 422, parsed.error.flatten());

  const created = await prisma.classRoom.create({ data: parsed.data });
  return ok(created, { status: 201 });
}
