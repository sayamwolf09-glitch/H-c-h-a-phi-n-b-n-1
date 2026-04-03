import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/rbac/guard";
import { ROLE_ADMIN, ROLE_TEACHER } from "@/lib/rbac/roles";
import { ok } from "@/lib/utils/api-response";

export async function GET(request: Request) {
  const guard = await requireRole([ROLE_ADMIN, ROLE_TEACHER]);
  if ("error" in guard) return guard.error;

  const url = new URL(request.url);
  const quizSetId = url.searchParams.get("quizSetId");

  const attempts = await prisma.attempt.findMany({
    where: {
      ...(quizSetId ? { quizSetId } : {})
    },
    include: {
      student: true,
      quizSet: true,
      answers: true
    },
    orderBy: { startedAt: "desc" }
  });

  return ok(attempts);
}
