"use client";

import { useState } from "react";

export default function ReportPage() {
  const [classRoomId, setClassRoomId] = useState("");

  const exportReport = () => {
    const url = `/api/reports/export?classRoomId=${encodeURIComponent(classRoomId)}`;
    window.open(url, "_blank");
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold text-chem-primary">Báo cáo lớp</h1>
      <div className="mt-5 rounded-2xl border border-chem-border bg-white p-5 shadow-card">
        <input
          className="w-full rounded-xl border p-3"
          placeholder="Nhập mã lớp"
          value={classRoomId}
          onChange={(e) => setClassRoomId(e.target.value)}
        />
        <button onClick={exportReport} className="mt-3 rounded-xl bg-chem-accent px-4 py-2 font-semibold text-white">
          Xuất báo cáo Excel
        </button>
      </div>
    </main>
  );
}
