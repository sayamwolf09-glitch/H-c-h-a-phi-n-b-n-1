import { QuizMode } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { fail, ok } from "@/lib/utils/api-response";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const classRoomId = url.searchParams.get("classRoomId");
  const gradeParam = url.searchParams.get("grade");
  const modeParam = url.searchParams.get("mode") as QuizMode | null;
  const quizSetId = url.searchParams.get("quizSetId");

  if (!modeParam) return fail("Thiếu mode", 422);

  const rows = await prisma.ranking.findMany({
    where: {
      mode: modeParam,
      ...(classRoomId ? { classRoomId } : {}),
      ...(gradeParam ? { grade: Number(gradeParam) } : {}),
      ...(quizSetId ? { quizSetId } : {})
    },
    include: {
      student: true,
      classRoom: true
    },
    orderBy: [{ rankPosition: "asc" }]
  });

  return ok(rows);
}
