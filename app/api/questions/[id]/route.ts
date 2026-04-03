import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/rbac/guard";
import { ROLE_ADMIN, ROLE_TEACHER } from "@/lib/rbac/roles";
import { fail, ok } from "@/lib/utils/api-response";
import { questionUpdateSchema } from "@/lib/validations/question";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const guard = await requireRole([ROLE_ADMIN, ROLE_TEACHER]);
  if ("error" in guard) return guard.error;

  const payload = await request.json();
  const parsed = questionUpdateSchema.safeParse({ ...payload, id: params.id });
  if (!parsed.success) return fail("Dữ liệu cập nhật câu hỏi không hợp lệ", 422, parsed.error.flatten());

  if (parsed.data.options) {
    await prisma.questionOption.deleteMany({ where: { questionId: params.id } });
  }

  const updated = await prisma.questionBank.update({
    where: { id: params.id },
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
      options: parsed.data.options
        ? {
            createMany: {
              data: parsed.data.options
            }
          }
        : undefined
    },
    include: { options: true }
  });

  return ok(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const guard = await requireRole([ROLE_ADMIN, ROLE_TEACHER]);
  if ("error" in guard) return guard.error;

  await prisma.questionBank.update({ where: { id: params.id }, data: { isActive: false } });
  return ok({ id: params.id, deleted: true });
}
