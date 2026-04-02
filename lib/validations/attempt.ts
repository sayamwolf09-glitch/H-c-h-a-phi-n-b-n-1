import { z } from "zod";

export const attemptStartSchema = z.object({
  quizSetId: z.string().cuid(),
  classRoomId: z.string().cuid(),
  studentName: z.string().min(2)
});

export const saveAnswerSchema = z.object({
  questionId: z.string().cuid(),
  selectedOptionId: z.string().cuid().optional(),
  answerText: z.string().optional(),
  mediaAssetId: z.string().cuid().optional()
});
