import { QuestionType } from "@prisma/client";
import { z } from "zod";

export const questionOptionSchema = z.object({
  label: z.string().optional(),
  content: z.string().min(1),
  isCorrect: z.boolean().default(false),
  orderIndex: z.number().int().default(0)
});

export const questionCreateSchema = z.object({
  code: z.string().min(3),
  title: z.string().min(3),
  content: z.string().min(5),
  questionType: z.nativeEnum(QuestionType),
  difficulty: z.number().int().min(1).max(5).default(1),
  subject: z.string().default("Hóa học"),
  grade: z.number().int().min(6).max(9).optional(),
  correctAnswerText: z.string().optional(),
  explanation: z.string().optional(),
  options: z.array(questionOptionSchema).optional()
});

export const questionUpdateSchema = questionCreateSchema.partial().extend({
  id: z.string().cuid()
});
