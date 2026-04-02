import { PrismaClient, QuestionType, QuizMode } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function normalizeName(fullName: string): string {
  return fullName.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
}

async function ensureRole(code: "ADMIN" | "TEACHER", name: string) {
  return prisma.role.upsert({
    where: { code },
    update: { name },
    create: { code, name }
  });
}

async function ensureUser(username: string, password: string, displayName: string) {
  const passwordHash = await bcrypt.hash(password, 12);
  return prisma.user.upsert({
    where: { username },
    update: { displayName, passwordHash, isActive: true },
    create: { username, displayName, passwordHash, isActive: true }
  });
}

async function main() {
  const adminRole = await ensureRole("ADMIN", "Quản trị viên");
  const teacherRole = await ensureRole("TEACHER", "Giáo viên");

  const admin = await ensureUser("NguyenHang", "2109@Hangyp", "Cô Nguyễn Hằng");
  const teacher = await ensureUser("BacNinh", "BacNinh@9899", "GV Bắc Ninh");

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
    update: {},
    create: { userId: admin.id, roleId: adminRole.id }
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: teacher.id, roleId: teacherRole.id } },
    update: {},
    create: { userId: teacher.id, roleId: teacherRole.id }
  });

  const class8A1 = await prisma.classRoom.upsert({
    where: { name_academicYear: { name: "8A1", academicYear: "2025-2026" } },
    update: { grade: 8, isActive: true },
    create: { name: "8A1", grade: 8, academicYear: "2025-2026", isActive: true }
  });

  const class8A2 = await prisma.classRoom.upsert({
    where: { name_academicYear: { name: "8A2", academicYear: "2025-2026" } },
    update: { grade: 8, isActive: true },
    create: { name: "8A2", grade: 8, academicYear: "2025-2026", isActive: true }
  });

  const class9A1 = await prisma.classRoom.upsert({
    where: { name_academicYear: { name: "9A1", academicYear: "2025-2026" } },
    update: { grade: 9, isActive: true },
    create: { name: "9A1", grade: 9, academicYear: "2025-2026", isActive: true }
  });

  for (const cls of [class8A1, class8A2, class9A1]) {
    await prisma.teacherClassPermission.upsert({
      where: { teacherId_classRoomId: { teacherId: teacher.id, classRoomId: cls.id } },
      update: { canManageStudents: true, canManageQuestions: true, canViewReports: true },
      create: {
        teacherId: teacher.id,
        classRoomId: cls.id,
        canManageStudents: true,
        canManageQuestions: true,
        canViewReports: true
      }
    });
  }

  const seededStudents = [
    { classRoomId: class8A1.id, fullName: "Nguyễn Minh Anh", studentCode: "8A1-01" },
    { classRoomId: class8A1.id, fullName: "Trần Gia Hân", studentCode: "8A1-02" },
    { classRoomId: class8A1.id, fullName: "Phạm Tuấn Kiệt", studentCode: "8A1-03" },
    { classRoomId: class8A2.id, fullName: "Lê Quốc Bảo", studentCode: "8A2-01" },
    { classRoomId: class8A2.id, fullName: "Đỗ Khánh Linh", studentCode: "8A2-02" },
    { classRoomId: class9A1.id, fullName: "Vũ Hải Đăng", studentCode: "9A1-01" }
  ];

  for (const item of seededStudents) {
    await prisma.student.upsert({
      where: { studentCode: item.studentCode },
      update: {
        classRoomId: item.classRoomId,
        fullName: item.fullName,
        normalizedFullName: normalizeName(item.fullName),
        isActive: true
      },
      create: {
        classRoomId: item.classRoomId,
        fullName: item.fullName,
        normalizedFullName: normalizeName(item.fullName),
        studentCode: item.studentCode,
        isActive: true
      }
    });
  }

  const q1 = await prisma.questionBank.upsert({
    where: { code: "CHEM-8-001" },
    update: {
      title: "Công thức của nước",
      content: "Chọn công thức hóa học đúng của nước.",
      questionType: QuestionType.MULTIPLE_CHOICE,
      grade: 8,
      subject: "Hóa học",
      createdById: teacher.id
    },
    create: {
      code: "CHEM-8-001",
      title: "Công thức của nước",
      content: "Chọn công thức hóa học đúng của nước.",
      questionType: QuestionType.MULTIPLE_CHOICE,
      grade: 8,
      subject: "Hóa học",
      createdById: teacher.id
    }
  });

  await prisma.questionOption.deleteMany({ where: { questionId: q1.id } });
  await prisma.questionOption.createMany({
    data: [
      { questionId: q1.id, label: "A", content: "CO2", isCorrect: false, orderIndex: 1 },
      { questionId: q1.id, label: "B", content: "H2O", isCorrect: true, orderIndex: 2 },
      { questionId: q1.id, label: "C", content: "NaCl", isCorrect: false, orderIndex: 3 }
    ]
  });

  const q2 = await prisma.questionBank.upsert({
    where: { code: "CHEM-8-002" },
    update: {
      title: "Bazơ mạnh",
      content: "Hãy nêu tên một bazơ mạnh thường gặp.",
      questionType: QuestionType.SHORT_ANSWER,
      grade: 8,
      subject: "Hóa học",
      correctAnswerText: "NaOH",
      createdById: teacher.id
    },
    create: {
      code: "CHEM-8-002",
      title: "Bazơ mạnh",
      content: "Hãy nêu tên một bazơ mạnh thường gặp.",
      questionType: QuestionType.SHORT_ANSWER,
      grade: 8,
      subject: "Hóa học",
      correctAnswerText: "NaOH",
      createdById: teacher.id
    }
  });

  const q3 = await prisma.questionBank.upsert({
    where: { code: "CHEM-9-001" },
    update: {
      title: "Phản ứng với oxy",
      content: "Video mô tả thí nghiệm đốt cháy, sản phẩm chính là gì?",
      questionType: QuestionType.VIDEO_BASED,
      grade: 9,
      subject: "Hóa học",
      correctAnswerText: "CO2",
      createdById: teacher.id
    },
    create: {
      code: "CHEM-9-001",
      title: "Phản ứng với oxy",
      content: "Video mô tả thí nghiệm đốt cháy, sản phẩm chính là gì?",
      questionType: QuestionType.VIDEO_BASED,
      grade: 9,
      subject: "Hóa học",
      correctAnswerText: "CO2",
      createdById: teacher.id
    }
  });

  const freePlayQuiz = await prisma.quizSet.upsert({
    where: { id: "cm-freeplay-8a1-quiz-id0000000000001" },
    update: {
      title: "Sân chơi Hóa học 8A1",
      mode: QuizMode.FREE_PLAY,
      classRoomId: class8A1.id,
      createdById: teacher.id,
      isPublished: true
    },
    create: {
      id: "cm-freeplay-8a1-quiz-id0000000000001",
      title: "Sân chơi Hóa học 8A1",
      description: "Ôn tập kiến thức cơ bản chương mở đầu",
      mode: QuizMode.FREE_PLAY,
      classRoomId: class8A1.id,
      createdById: teacher.id,
      allowRetake: true,
      showRankingAfterComplete: true,
      isPublished: true
    }
  });

  const examQuiz = await prisma.quizSet.upsert({
    where: { id: "cm-exam-8a1-quiz-id0000000000000001" },
    update: {
      title: "Kiểm tra nhanh 8A1",
      mode: QuizMode.EXAM,
      classRoomId: class8A1.id,
      createdById: teacher.id,
      maxAttemptsPerStudent: 1,
      requireAllQuestionsToExit: true,
      isPublished: true
    },
    create: {
      id: "cm-exam-8a1-quiz-id0000000000000001",
      title: "Kiểm tra nhanh 8A1",
      description: "Đánh giá nhanh sau bài học",
      mode: QuizMode.EXAM,
      classRoomId: class8A1.id,
      createdById: teacher.id,
      allowRetake: false,
      maxAttemptsPerStudent: 1,
      requireAllQuestionsToExit: true,
      showRankingAfterComplete: true,
      isPublished: true
    }
  });

  await prisma.quizSetQuestion.deleteMany({ where: { quizSetId: { in: [freePlayQuiz.id, examQuiz.id] } } });
  await prisma.quizSetQuestion.createMany({
    data: [
      { quizSetId: freePlayQuiz.id, questionId: q1.id, orderIndex: 1, point: 5 },
      { quizSetId: freePlayQuiz.id, questionId: q2.id, orderIndex: 2, point: 5 },
      { quizSetId: examQuiz.id, questionId: q1.id, orderIndex: 1, point: 5 },
      { quizSetId: examQuiz.id, questionId: q2.id, orderIndex: 2, point: 5 },
      { quizSetId: examQuiz.id, questionId: q3.id, orderIndex: 3, point: 5 }
    ]
  });

  const minhAnh = await prisma.student.findUniqueOrThrow({ where: { studentCode: "8A1-01" } });
  const giaHan = await prisma.student.findUniqueOrThrow({ where: { studentCode: "8A1-02" } });

  const attempt1 = await prisma.attempt.upsert({
    where: { quizSetId_studentId_attemptNo: { quizSetId: freePlayQuiz.id, studentId: minhAnh.id, attemptNo: 1 } },
    update: {
      status: "SUBMITTED",
      score: 10,
      correctCount: 2,
      wrongCount: 0,
      unansweredCount: 0,
      durationSeconds: 150,
      submittedAt: new Date()
    },
    create: {
      quizSetId: freePlayQuiz.id,
      studentId: minhAnh.id,
      studentNameInput: minhAnh.fullName,
      mode: QuizMode.FREE_PLAY,
      status: "SUBMITTED",
      score: 10,
      correctCount: 2,
      wrongCount: 0,
      unansweredCount: 0,
      durationSeconds: 150,
      attemptNo: 1,
      submittedAt: new Date()
    }
  });

  const attempt2 = await prisma.attempt.upsert({
    where: { quizSetId_studentId_attemptNo: { quizSetId: examQuiz.id, studentId: giaHan.id, attemptNo: 1 } },
    update: {
      status: "SUBMITTED",
      score: 10,
      correctCount: 2,
      wrongCount: 1,
      unansweredCount: 0,
      durationSeconds: 260,
      submittedAt: new Date()
    },
    create: {
      quizSetId: examQuiz.id,
      studentId: giaHan.id,
      studentNameInput: giaHan.fullName,
      mode: QuizMode.EXAM,
      status: "SUBMITTED",
      score: 10,
      correctCount: 2,
      wrongCount: 1,
      unansweredCount: 0,
      durationSeconds: 260,
      attemptNo: 1,
      submittedAt: new Date()
    }
  });

  await prisma.attemptAnswer.deleteMany({ where: { attemptId: { in: [attempt1.id, attempt2.id] } } });
  await prisma.attemptAnswer.createMany({
    data: [
      { attemptId: attempt1.id, questionId: q1.id, isCorrect: true, scoreAwarded: 5 },
      { attemptId: attempt1.id, questionId: q2.id, answerText: "NaOH", isCorrect: true, scoreAwarded: 5 },
      { attemptId: attempt2.id, questionId: q1.id, isCorrect: true, scoreAwarded: 5 },
      { attemptId: attempt2.id, questionId: q2.id, answerText: "NaOH", isCorrect: true, scoreAwarded: 5 },
      { attemptId: attempt2.id, questionId: q3.id, answerText: "CO", isCorrect: false, scoreAwarded: 0 }
    ]
  });

  await prisma.ranking.deleteMany({
    where: {
      classRoomId: class8A1.id,
      quizSetId: { in: [freePlayQuiz.id, examQuiz.id] }
    }
  });

  await prisma.ranking.createMany({
    data: [
      {
        mode: QuizMode.FREE_PLAY,
        classRoomId: class8A1.id,
        grade: 8,
        quizSetId: freePlayQuiz.id,
        studentId: minhAnh.id,
        bestScore: 10,
        bestDurationSeconds: 150,
        attemptCount: 1,
        rankPosition: 1
      },
      {
        mode: QuizMode.EXAM,
        classRoomId: class8A1.id,
        grade: 8,
        quizSetId: examQuiz.id,
        studentId: giaHan.id,
        bestScore: 10,
        bestDurationSeconds: 260,
        attemptCount: 1,
        rankPosition: 1
      }
    ]
  });

  await prisma.report.create({
    data: {
      scope: "CLASS",
      classRoomId: class8A1.id,
      generatedById: teacher.id,
      summaryJson: {
        seed: true,
        className: class8A1.name,
        totalStudents: 3,
        generatedAt: new Date().toISOString()
      }
    }
  });

  await prisma.activityLog.createMany({
    data: [
      {
        actorUserId: admin.id,
        action: "SEED_INIT",
        entityType: "SYSTEM",
        metadataJson: { note: "Khởi tạo dữ liệu mẫu ChemPlay" }
      },
      {
        actorUserId: teacher.id,
        action: "SEED_QUIZ_CREATE",
        entityType: "QUIZ",
        entityId: examQuiz.id,
        metadataJson: { classRoom: class8A1.name }
      }
    ]
  });

  console.log("✅ Seed hoàn tất dữ liệu mẫu ChemPlay Classroom");
}

main()
  .catch((error) => {
    console.error("❌ Seed thất bại:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
