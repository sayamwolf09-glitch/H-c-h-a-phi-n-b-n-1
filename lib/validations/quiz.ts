import { QuizMode } from "@prisma/client";
import { z } from "zod";

export const quizCreateSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  mode: z.nativeEnum(QuizMode),
  classRoomId: z.string().cuid(),
  allowRetake: z.boolean().default(true),
  maxAttemptsPerStudent: z.number().int().min(1).optional(),
  requireAllQuestionsToExit: z.boolean().default(false),
  showRankingAfterComplete: z.boolean().default(true),
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
  isPublished: z.boolean().default(false),
  questionItems: z.array(
    z.object({
      questionId: z.string().cuid(),
      orderIndex: z.number().int().nonnegative(),
      point: z.number().positive().default(1)
    })
  )
});
