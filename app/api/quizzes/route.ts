import { prisma } from "@/lib/db/prisma";
import { requireRole, requireTeacherClassAccess } from "@/lib/rbac/guard";
import { ROLE_ADMIN, ROLE_TEACHER } from "@/lib/rbac/roles";
import { fail, ok } from "@/lib/utils/api-response";
import { quizCreateSchema } from "@/lib/validations/quiz";

export async function GET(request: Request) {
  const guard = await requireRole([ROLE_ADMIN, ROLE_TEACHER]);
  if ("error" in guard) return guard.error;

  const url = new URL(request.url);
  const classRoomId = url.searchParams.get("classRoomId");
  if (classRoomId) {
    const classGuard = await requireTeacherClassAccess(classRoomId);
    if ("error" in classGuard) return classGuard.error;
  }

  const quizzes = await prisma.quizSet.findMany({
    where: {
      ...(classRoomId ? { classRoomId } : {})
    },
    include: {
      quizQuestions: {
        include: {
          question: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return ok(quizzes);
}

export async function POST(request: Request) {
  const guard = await requireRole([ROLE_ADMIN, ROLE_TEACHER]);
  if ("error" in guard) return guard.error;

  const payload = await request.json();
  const parsed = quizCreateSchema.safeParse(payload);
  if (!parsed.success) return fail("Dữ liệu bộ đề không hợp lệ", 422, parsed.error.flatten());

  const classGuard = await requireTeacherClassAccess(parsed.data.classRoomId);
  if ("error" in classGuard) return classGuard.error;

  const created = await prisma.quizSet.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      mode: parsed.data.mode,
      classRoomId: parsed.data.classRoomId,
      createdById: guard.session.user.id,
      allowRetake: parsed.data.allowRetake,
      maxAttemptsPerStudent: parsed.data.maxAttemptsPerStudent,
      requireAllQuestionsToExit: parsed.data.requireAllQuestionsToExit,
      showRankingAfterComplete: parsed.data.showRankingAfterComplete,
      startAt: parsed.data.startAt ? new Date(parsed.data.startAt) : null,
      endAt: parsed.data.endAt ? new Date(parsed.data.endAt) : null,
      isPublished: parsed.data.isPublished,
      quizQuestions: {
        createMany: {
          data: parsed.data.questionItems
        }
      }
    },
    include: {
      quizQuestions: true
    }
  });

  return ok(created, { status: 201 });
}
