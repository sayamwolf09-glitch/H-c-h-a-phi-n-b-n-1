import { z } from "zod";

export const classroomCreateSchema = z.object({
  name: z.string().min(2, "Tên lớp tối thiểu 2 ký tự"),
  grade: z.number().int().min(6).max(9),
  academicYear: z.string().min(4),
  isActive: z.boolean().optional().default(true)
});

export const classroomUpdateSchema = classroomCreateSchema.partial();
