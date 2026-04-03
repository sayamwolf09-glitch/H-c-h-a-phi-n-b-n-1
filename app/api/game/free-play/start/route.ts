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
  if (!parsed.success) return fail("Dữ liệu bắt đầu lượt chơi không hợp lệ", 422, parsed.error.flatten());

  const student = await prisma.student.findFirst({
    where: {
      classRoomId: parsed.data.classRoomId,
      normalizedFullName: normalizeName(parsed.data.studentName),
      isActive: true
    }
  });

  if (!student) {
    const created = await prisma.student.create({
      data: {
        classRoomId: parsed.data.classRoomId,
        fullName: parsed.data.studentName,
        normalizedFullName: normalizeName(parsed.data.studentName)
      }
    });

    const attempt = await prisma.attempt.create({
      data: {
        quizSetId: parsed.data.quizSetId,
        studentId: created.id,
        studentNameInput: parsed.data.studentName,
        mode: QuizMode.FREE_PLAY,
        attemptNo: 1
      }
    });

    return ok(attempt, { status: 201 });
  }

  const latestAttempt = await prisma.attempt.findFirst({
    where: { quizSetId: parsed.data.quizSetId, studentId: student.id },
    orderBy: { attemptNo: "desc" }
  });

  const attempt = await prisma.attempt.create({
    data: {
      quizSetId: parsed.data.quizSetId,
      studentId: student.id,
      studentNameInput: parsed.data.studentName,
      mode: QuizMode.FREE_PLAY,
      attemptNo: (latestAttempt?.attemptNo ?? 0) + 1
    }
  });

  return ok(attempt, { status: 201 });
}
