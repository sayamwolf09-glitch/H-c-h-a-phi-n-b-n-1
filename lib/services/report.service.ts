import ExcelJS from "exceljs";
import { prisma } from "@/lib/db/prisma";

export async function buildClassReportWorkbook(classRoomId: string) {
  const classroom = await prisma.classRoom.findUnique({
    where: { id: classRoomId },
    include: {
      students: true,
      quizSets: {
        include: {
          attempts: true
        }
      }
    }
  });

  if (!classroom) {
    throw new Error("Không tìm thấy lớp");
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("BaoCaoLop");

  sheet.columns = [
    { header: "Lớp", key: "className", width: 15 },
    { header: "Học sinh", key: "studentName", width: 32 },
    { header: "Bài", key: "quizTitle", width: 30 },
    { header: "Điểm", key: "score", width: 12 },
    { header: "Đúng", key: "correctCount", width: 10 },
    { header: "Sai", key: "wrongCount", width: 10 },
    { header: "Trạng thái", key: "status", width: 15 }
  ];

  for (const quiz of classroom.quizSets) {
    for (const attempt of quiz.attempts) {
      const student = classroom.students.find((item) => item.id === attempt.studentId);
      sheet.addRow({
        className: classroom.name,
        studentName: student?.fullName ?? "N/A",
        quizTitle: quiz.title,
        score: attempt.score,
        correctCount: attempt.correctCount,
        wrongCount: attempt.wrongCount,
        status: attempt.status
      });
    }
  }

  return workbook;
}
