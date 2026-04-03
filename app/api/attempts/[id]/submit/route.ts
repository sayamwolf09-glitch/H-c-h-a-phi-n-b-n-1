import { prisma } from "@/lib/db/prisma";
import { recomputeRanking } from "@/lib/services/ranking.service";
import { scoreOneAnswer } from "@/lib/services/scoring.service";
import { writeAuditLog } from "@/lib/services/audit-log.service";
import { fail, ok } from "@/lib/utils/api-response";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const attempt = await prisma.attempt.findUnique({
    where: { id: params.id },
    include: {
      quizSet: {
        include: {
          classRoom: true,
          quizQuestions: {
            include: {
              question: {
                include: { options: true }
              }
            }
          }
        }
      },
      answers: true
    }
  });

  if (!attempt) return fail("Không tìm thấy lượt làm bài", 404);
  if (attempt.status !== "IN_PROGRESS") return fail("Lượt làm bài đã nộp trước đó", 422);

  if (attempt.quizSet.requireAllQuestionsToExit && attempt.answers.length < attempt.quizSet.quizQuestions.length) {
    return fail("Bắt buộc trả lời hết câu hỏi trước khi nộp", 422);
  }

  let score = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;

  for (const quizQuestion of attempt.quizSet.quizQuestions) {
    const answer = attempt.answers.find((item) => item.questionId === quizQuestion.questionId);
    if (!answer) {
      unansweredCount += 1;
      continue;
    }

    const result = scoreOneAnswer({
      question: quizQuestion.question,
      answer,
      point: quizQuestion.point
    });

    await prisma.attemptAnswer.update({
      where: { id: answer.id },
      data: {
        isCorrect: result.isCorrect,
        scoreAwarded: result.scoreAwarded
      }
    });

    score += result.scoreAwarded;
    if (result.isCorrect) correctCount += 1;
    else wrongCount += 1;
  }

  const now = new Date();
  const durationSeconds = Math.max(0, Math.floor((now.getTime() - attempt.startedAt.getTime()) / 1000));

  const submitted = await prisma.attempt.update({
    where: { id: attempt.id },
    data: {
      status: "SUBMITTED",
      submittedAt: now,
      durationSeconds,
      score,
      correctCount,
      wrongCount,
      unansweredCount
    }
  });

  await recomputeRanking({
    classRoomId: attempt.quizSet.classRoomId,
    grade: attempt.quizSet.classRoom.grade,
    mode: attempt.mode,
    quizSetId: attempt.mode === "EXAM" ? attempt.quizSetId : undefined
  });

  await writeAuditLog({
    actorStudentId: attempt.studentId,
    action: "ATTEMPT_SUBMIT",
    entityType: "ATTEMPT",
    entityId: attempt.id,
    metadata: {
      quizSetId: attempt.quizSetId,
      mode: attempt.mode,
      score
    }
  });

  return ok(submitted);
}
