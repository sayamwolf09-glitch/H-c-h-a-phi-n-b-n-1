import { prisma } from "@/lib/db/prisma";
import { requireRole, requireTeacherClassAccess } from "@/lib/rbac/guard";
import { ROLE_ADMIN, ROLE_TEACHER } from "@/lib/rbac/roles";
import { ok, fail } from "@/lib/utils/api-response";
import { studentCreateSchema } from "@/lib/validations/student";

function normalizeName(fullName: string): string {
  return fullName.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
}

export async function GET(request: Request) {
  const guard = await requireRole([ROLE_ADMIN, ROLE_TEACHER]);
  if ("error" in guard) return guard.error;

  const url = new URL(request.url);
  const classRoomId = url.searchParams.get("classRoomId");

  if (!classRoomId) {
    return fail("Thiếu classRoomId", 422);
  }

  const classGuard = await requireTeacherClassAccess(classRoomId);
  if ("error" in classGuard) return classGuard.error;

  const students = await prisma.student.findMany({
    where: { classRoomId },
    orderBy: { fullName: "asc" }
  });

  return ok(students);
}

export async function POST(request: Request) {
  const guard = await requireRole([ROLE_ADMIN, ROLE_TEACHER]);
  if ("error" in guard) return guard.error;

  const payload = await request.json();
  const parsed = studentCreateSchema.safeParse(payload);
  if (!parsed.success) return fail("Dữ liệu học sinh không hợp lệ", 422, parsed.error.flatten());

  const classGuard = await requireTeacherClassAccess(parsed.data.classRoomId);
  if ("error" in classGuard) return classGuard.error;

  const created = await prisma.student.create({
    data: {
      classRoomId: parsed.data.classRoomId,
      fullName: parsed.data.fullName,
      normalizedFullName: normalizeName(parsed.data.fullName),
      studentCode: parsed.data.studentCode ?? null,
      isActive: parsed.data.isActive
    }
  });

  return ok(created, { status: 201 });
}
