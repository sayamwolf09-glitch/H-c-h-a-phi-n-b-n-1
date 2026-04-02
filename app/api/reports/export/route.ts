import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/rbac/guard";
import { ROLE_ADMIN, ROLE_TEACHER } from "@/lib/rbac/roles";
import { buildClassReportWorkbook } from "@/lib/services/report.service";
import { fail } from "@/lib/utils/api-response";

export async function GET(request: Request) {
  const guard = await requireRole([ROLE_ADMIN, ROLE_TEACHER]);
  if ("error" in guard) return guard.error;

  const url = new URL(request.url);
  const classRoomId = url.searchParams.get("classRoomId");
  if (!classRoomId) return fail("Thiếu classRoomId", 422);

  const workbook = await buildClassReportWorkbook(classRoomId);
  const buffer = await workbook.xlsx.writeBuffer();

  const createdReport = await prisma.report.create({
    data: {
      scope: "CLASS",
      classRoomId,
      generatedById: guard.session.user.id,
      summaryJson: {
        generatedAt: new Date().toISOString(),
        format: "xlsx"
      }
    }
  });

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="bao-cao-lop-${classRoomId}.xlsx"`,
      "X-Report-Id": createdReport.id
    }
  });
}
