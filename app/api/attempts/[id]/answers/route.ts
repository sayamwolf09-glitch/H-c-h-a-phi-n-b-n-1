import { prisma } from "@/lib/db/prisma";
import { fail, ok } from "@/lib/utils/api-response";
import { saveAnswerSchema } from "@/lib/validations/attempt";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const parsed = saveAnswerSchema.safeParse(body);
  if (!parsed.success) return fail("Dữ liệu trả lời không hợp lệ", 422, parsed.error.flatten());

  const attempt = await prisma.attempt.findUnique({ where: { id: params.id } });
  if (!attempt) return fail("Không tìm thấy lượt làm bài", 404);
  if (attempt.status !== "IN_PROGRESS") return fail("Lượt làm bài đã nộp", 422);

  const saved = await prisma.attemptAnswer.upsert({
    where: {
      attemptId_questionId: {
        attemptId: params.id,
        questionId: parsed.data.questionId
      }
    },
    update: {
      answerText: parsed.data.answerText,
      selectedOptionId: parsed.data.selectedOptionId,
      mediaAssetId: parsed.data.mediaAssetId,
      answeredAt: new Date()
    },
    create: {
      attemptId: params.id,
      questionId: parsed.data.questionId,
      answerText: parsed.data.answerText,
      selectedOptionId: parsed.data.selectedOptionId,
      mediaAssetId: parsed.data.mediaAssetId
    }
  });

  return ok(saved);
}
