import { z } from "zod";

export const studentCreateSchema = z.object({
  classRoomId: z.string().cuid(),
  fullName: z.string().min(2),
  studentCode: z.string().min(1).optional(),
  isActive: z.boolean().optional().default(true)
});

export const studentUpdateSchema = studentCreateSchema.partial().extend({
  id: z.string().cuid()
});
