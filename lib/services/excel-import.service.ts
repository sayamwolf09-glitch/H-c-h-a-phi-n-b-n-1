import XLSX from "xlsx";
import { prisma } from "@/lib/db/prisma";

function normalizeName(fullName: string): string {
  return fullName.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
}

export async function importStudentsFromExcel(params: {
  classRoomId: string;
  fileBuffer: Buffer;
  createdById: string;
  sourceFileName: string;
}) {
  const job = await prisma.importJob.create({
    data: {
      createdById: params.createdById,
      classRoomId: params.classRoomId,
      sourceFileName: params.sourceFileName,
      status: "PROCESSING",
      startedAt: new Date()
    }
  });

  try {
    const workbook = XLSX.read(params.fileBuffer, { type: "buffer" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<{ fullName: string; studentCode?: string }>(firstSheet, {
      raw: false,
      defval: ""
    });

    let successRows = 0;
    const errors: Array<{ row: number; message: string }> = [];

    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      const fullName = String(row.fullName ?? "").trim();
      if (!fullName) {
        errors.push({ row: i + 2, message: "Thiếu họ tên" });
        continue;
      }

      await prisma.student.create({
        data: {
          classRoomId: params.classRoomId,
          fullName,
          normalizedFullName: normalizeName(fullName),
          studentCode: row.studentCode ? String(row.studentCode).trim() : null
        }
      });
      successRows += 1;
    }

    await prisma.importJob.update({
      where: { id: job.id },
      data: {
        totalRows: rows.length,
        successRows,
        failedRows: rows.length - successRows,
        errorRowsJson: errors,
        status: "COMPLETED",
        finishedAt: new Date()
      }
    });

    return { totalRows: rows.length, successRows, failedRows: rows.length - successRows, errors };
  } catch (error) {
    await prisma.importJob.update({
      where: { id: job.id },
      data: {
        status: "FAILED",
        finishedAt: new Date(),
        errorRowsJson: [{ row: 0, message: error instanceof Error ? error.message : "Import thất bại" }]
      }
    });
    throw error;
  }
}
