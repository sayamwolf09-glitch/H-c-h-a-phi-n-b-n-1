import { QuizMode } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export async function recomputeRanking(input: {
  classRoomId: string;
  grade: number;
  mode: QuizMode;
  quizSetId?: string;
}) {
  const attempts = await prisma.attempt.findMany({
    where: {
      quizSet: {
        classRoomId: input.classRoomId,
        mode: input.mode
      },
      ...(input.quizSetId ? { quizSetId: input.quizSetId } : {}),
      status: "SUBMITTED"
    },
    orderBy: [{ score: "desc" }, { durationSeconds: "asc" }]
  });

  const bestByStudent = new Map<string, (typeof attempts)[number]>();

  for (const attempt of attempts) {
    const current = bestByStudent.get(attempt.studentId);
    if (!current) {
      bestByStudent.set(attempt.studentId, attempt);
      continue;
    }
    if (attempt.score > current.score) {
      bestByStudent.set(attempt.studentId, attempt);
      continue;
    }
    if (attempt.score === current.score && (attempt.durationSeconds ?? 999999) < (current.durationSeconds ?? 999999)) {
      bestByStudent.set(attempt.studentId, attempt);
    }
  }

  const sorted = Array.from(bestByStudent.values()).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (a.durationSeconds ?? 999999) - (b.durationSeconds ?? 999999);
  });

  await prisma.$transaction([
    prisma.ranking.deleteMany({
      where: {
        mode: input.mode,
        classRoomId: input.classRoomId,
        ...(input.quizSetId ? { quizSetId: input.quizSetId } : { quizSetId: null })
      }
    }),
    ...sorted.map((attempt, idx) =>
      prisma.ranking.create({
        data: {
          mode: input.mode,
          classRoomId: input.classRoomId,
          grade: input.grade,
          quizSetId: input.quizSetId,
          studentId: attempt.studentId,
          bestScore: attempt.score,
          bestDurationSeconds: attempt.durationSeconds,
          attemptCount: attempts.filter((a) => a.studentId === attempt.studentId).length,
          rankPosition: idx + 1
        }
      })
    )
  ]);
}
