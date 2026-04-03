"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuestionRenderer, type UiQuestion } from "@/components/question/question-renderer";
import { apiFetch } from "@/lib/client/http";

const DEMO_QUESTIONS: UiQuestion[] = [
  {
    id: "q1",
    type: "MULTIPLE_CHOICE",
    title: "Câu 1",
    content: "Công thức hóa học của nước là gì?",
    options: [
      { id: "a", content: "CO2" },
      { id: "b", content: "H2O" },
      { id: "c", content: "NaCl" }
    ]
  },
  {
    id: "q2",
    type: "SHORT_ANSWER",
    title: "Câu 2",
    content: "Viết tên một bazơ mạnh thường gặp."
  }
];

export default function QuizPlayPage() {
  const router = useRouter();
  const { attemptId } = useParams<{ attemptId: string }>();

  const [current, setCurrent] = useState(0);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [encourageMessage, setEncourageMessage] = useState("");

  const question = useMemo(() => DEMO_QUESTIONS[current], [current]);

  const getEncouragement = () => {
    const messages = [
      "Xuất sắc! Em vừa vượt qua câu hỏi này 👏",
      "Giỏi lắm! Cô Hằng khen em trả lời rất tốt 🌟",
      "Tuyệt vời! Em đang tiến bộ từng câu rồi 🚀",
      "Đỉnh quá! Tiếp tục giữ phong độ nhé 💪"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const isPassedQuestion = (payload: { answerText?: string; selectedOptionId?: string }) => {
    if (question.id === "q1") {
      return payload.selectedOptionId === "b";
    }

    if (question.id === "q2") {
      const normalized = (payload.answerText ?? "")
        .normalize("NFKC")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();
      return normalized === "naoh";
    }

    return false;
  };

  const handleAnswer = async (payload: { answerText?: string; selectedOptionId?: string }) => {
    setSaving(true);
    try {
      await apiFetch(`/api/attempts/${attemptId}/answers`, {
        method: "POST",
        body: JSON.stringify({ questionId: question.id, ...payload })
      });
      setNotice("Đã lưu câu trả lời");
      if (isPassedQuestion(payload)) {
        setEncourageMessage(getEncouragement());
        window.setTimeout(() => setEncourageMessage(""), 2200);
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Lỗi lưu câu trả lời");
    } finally {
      setSaving(false);
    }
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      await apiFetch(`/api/attempts/${attemptId}/submit`, { method: "POST" });
      router.push(`/ket-qua/${attemptId}`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Nộp bài thất bại");
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid gap-4 md:grid-cols-[1fr_240px]">
        <div>
          <QuestionRenderer question={question} onAnswerChange={handleAnswer} />
          <div className="mt-4 flex items-center justify-between">
            <button
              disabled={current === 0}
              onClick={() => setCurrent((v) => Math.max(0, v - 1))}
              className="rounded-xl border px-4 py-2 disabled:opacity-50"
            >
              Câu trước
            </button>
            <button
              disabled={current === DEMO_QUESTIONS.length - 1}
              onClick={() => setCurrent((v) => Math.min(DEMO_QUESTIONS.length - 1, v + 1))}
              className="rounded-xl border px-4 py-2 disabled:opacity-50"
            >
              Câu sau
            </button>
          </div>
          {notice ? <p className="mt-3 text-sm text-chem-muted">{saving ? "Đang lưu..." : notice}</p> : null}
          {encourageMessage ? (
            <div className="mt-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
              {encourageMessage}
            </div>
          ) : null}
        </div>

        <aside className="rounded-2xl border border-chem-border bg-white p-4 shadow-card">
          <h3 className="font-bold text-chem-primary">Điều hướng câu hỏi</h3>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {DEMO_QUESTIONS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrent(idx)}
                className={`rounded-lg p-2 text-sm ${idx === current ? "bg-chem-primary text-white" : "bg-slate-100"}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <button
            onClick={submit}
            disabled={submitting}
            className="mt-5 w-full rounded-xl bg-chem-accent p-3 font-semibold text-white"
          >
            {submitting ? "Đang nộp..." : "Nộp bài"}
          </button>
        </aside>
      </div>
    </main>
  );
}
