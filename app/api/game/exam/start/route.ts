import { QuizMode } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { fail, ok } from "@/lib/utils/api-response";
import { attemptStartSchema } from "@/lib/validations/attempt";

function normalizeName(fullName: string): string {
  return fullName.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
}

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = attemptStartSchema.safeParse(payload);
  if (!parsed.success) return fail("Dữ liệu bắt đầu vào thi không hợp lệ", 422, parsed.error.flatten());

  const quiz = await prisma.quizSet.findUnique({ where: { id: parsed.data.quizSetId } });
  if (!quiz) return fail("Không tìm thấy bài thi", 404);
  if (quiz.mode !== QuizMode.EXAM) return fail("Bài này không thuộc chế độ Vào thi", 422);

  const student = await prisma.student.findFirst({
    where: {
      classRoomId: parsed.data.classRoomId,
      normalizedFullName: normalizeName(parsed.data.studentName),
      isActive: true
    }
  });

  if (!student) return fail("Tên học sinh không tồn tại trong danh sách lớp", 403);

  const totalAttempts = await prisma.attempt.count({
    where: { quizSetId: parsed.data.quizSetId, studentId: student.id }
  });

  const maxAllowed = quiz.maxAttemptsPerStudent ?? 1;
  if (totalAttempts >= maxAllowed) {
    return fail("Bạn đã hết số lượt làm bài thi", 403);
  }

  const attempt = await prisma.attempt.create({
    data: {
      quizSetId: parsed.data.quizSetId,
      studentId: student.id,
      studentNameInput: parsed.data.studentName,
      mode: QuizMode.EXAM,
      attemptNo: totalAttempts + 1
    }
  });

  return ok(attempt, { status: 201 });
}
