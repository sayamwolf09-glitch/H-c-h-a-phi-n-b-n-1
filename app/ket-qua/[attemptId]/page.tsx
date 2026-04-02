"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function ResultPage() {
  const { attemptId } = useParams<{ attemptId: string }>();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-3xl border border-chem-border bg-white p-6 shadow-card">
        <h1 className="text-3xl font-bold text-chem-primary">Kết quả bài làm</h1>
        <p className="mt-2 text-sm text-chem-muted">Mã lượt làm: {attemptId}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-blue-50 p-4">
            <p className="text-sm text-chem-muted">Điểm</p>
            <p className="text-2xl font-bold text-blue-700">8.5</p>
          </div>
          <div className="rounded-xl bg-green-50 p-4">
            <p className="text-sm text-chem-muted">Số câu đúng</p>
            <p className="text-2xl font-bold text-green-700">17</p>
          </div>
          <div className="rounded-xl bg-red-50 p-4">
            <p className="text-sm text-chem-muted">Số câu sai</p>
            <p className="text-2xl font-bold text-red-600">3</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/bang-xep-hang" className="rounded-xl bg-chem-primary px-4 py-2 font-semibold text-white">
            Xem bảng xếp hạng
          </Link>
          <Link href="/" className="rounded-xl border border-chem-border px-4 py-2 font-semibold">
            Về trang chủ
          </Link>
        </div>
      </div>
    </main>
  );
}
