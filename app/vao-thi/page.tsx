"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client/http";

export default function ExamPage() {
  const router = useRouter();
  const [quizSetId, setQuizSetId] = useState("");
  const [classRoomId, setClassRoomId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const data = await apiFetch<{ id: string }>("/api/game/exam/start", {
        method: "POST",
        body: JSON.stringify({ quizSetId, classRoomId, studentName })
      });
      router.push(`/lam-bai/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể vào thi");
    }
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-3xl font-bold text-chem-primary">Vào thi</h1>
      <p className="mt-2 text-sm text-chem-muted">Tên phải trùng khớp với danh sách học sinh trong lớp.</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-3 rounded-2xl border border-chem-border bg-white p-5 shadow-card">
        <input className="w-full rounded-xl border p-3" placeholder="Mã bài thi" value={quizSetId} onChange={(e) => setQuizSetId(e.target.value)} />
        <input className="w-full rounded-xl border p-3" placeholder="Mã lớp" value={classRoomId} onChange={(e) => setClassRoomId(e.target.value)} />
        <input className="w-full rounded-xl border p-3" placeholder="Họ và tên học sinh" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <button className="w-full rounded-xl bg-blue-700 p-3 font-semibold text-white">Bắt đầu làm bài</button>
      </form>
    </main>
  );
}
