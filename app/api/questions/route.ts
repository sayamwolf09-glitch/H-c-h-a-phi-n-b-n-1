import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/rbac/guard";
import { ROLE_ADMIN, ROLE_TEACHER } from "@/lib/rbac/roles";
import { fail, ok } from "@/lib/utils/api-response";
import { questionCreateSchema } from "@/lib/validations/question";

export async function GET(request: Request) {
  const guard = await requireRole([ROLE_ADMIN, ROLE_TEACHER]);
  if ("error" in guard) return guard.error;

  const url = new URL(request.url);
  const gradeParam = url.searchParams.get("grade");
  const questionType = url.searchParams.get("questionType");

  const questions = await prisma.questionBank.findMany({
    where: {
      isActive: true,
      ...(gradeParam ? { grade: Number(gradeParam) } : {}),
      ...(questionType ? { questionType: questionType as never } : {})
    },
    include: {
      options: true
    },
    orderBy: { createdAt: "desc" }
  });

  return ok(questions);
}

export async function POST(request: Request) {
  const guard = await requireRole([ROLE_ADMIN, ROLE_TEACHER]);
  if ("error" in guard) return guard.error;

  const payload = await request.json();
  const parsed = questionCreateSchema.safeParse(payload);
  if (!parsed.success) return fail("Dữ liệu câu hỏi không hợp lệ", 422, parsed.error.flatten());

  const created = await prisma.questionBank.create({
    data: {
      code: parsed.data.code,
      title: parsed.data.title,
      content: parsed.data.content,
      questionType: parsed.data.questionType,
      difficulty: parsed.data.difficulty,
      subject: parsed.data.subject,
      grade: parsed.data.grade,
      correctAnswerText: parsed.data.correctAnswerText,
      explanation: parsed.data.explanation,
      createdById: guard.session.user.id,
      options: parsed.data.options
        ? {
            createMany: {
              data: parsed.data.options
            }
          }
        : undefined
    },
    include: {
      options: true
    }
  });

  return ok(created, { status: 201 });
}
