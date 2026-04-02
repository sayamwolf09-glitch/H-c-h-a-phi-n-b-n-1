"use client";

import { FormEvent, useState } from "react";

export default function ImportExcelPage() {
  const [classRoomId, setClassRoomId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const form = new FormData();
    form.append("classRoomId", classRoomId);
    form.append("file", file);

    const res = await fetch("/api/students/import", { method: "POST", body: form });
    const json = await res.json();

    if (!res.ok || !json.success) {
      setMessage(json.message ?? "Import thất bại");
      return;
    }

    setMessage(`Import thành công ${json.data.successRows}/${json.data.totalRows} học sinh`);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold text-chem-primary">Import học sinh từ Excel</h1>
      <form onSubmit={onSubmit} className="mt-5 space-y-3 rounded-2xl border border-chem-border bg-white p-5 shadow-card">
        <input
          className="w-full rounded-xl border p-3"
          placeholder="Mã lớp"
          value={classRoomId}
          onChange={(e) => setClassRoomId(e.target.value)}
        />
        <input type="file" accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="w-full rounded-xl border p-3" />
        <button className="rounded-xl bg-chem-primary px-4 py-2 font-semibold text-white">Import</button>
        {message ? <p className="text-sm text-chem-muted">{message}</p> : null}
      </form>
    </main>
  );
}
