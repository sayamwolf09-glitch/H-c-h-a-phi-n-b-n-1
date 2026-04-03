"use client";

import { FormEvent, useState } from "react";

export default function QrCodePage() {
  const [target, setTarget] = useState("http://localhost:3000/chon-che-do");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const generate = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/qr/generate?target=${encodeURIComponent(target)}`);
    const json = await res.json();
    if (json.success) setQrDataUrl(json.data.qrDataUrl);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold text-chem-primary">Tạo mã QR truy cập</h1>
      <form onSubmit={generate} className="mt-5 space-y-3 rounded-2xl border border-chem-border bg-white p-5 shadow-card">
        <input value={target} onChange={(e) => setTarget(e.target.value)} className="w-full rounded-xl border p-3" />
        <button className="rounded-xl bg-chem-primary px-4 py-2 font-semibold text-white">Tạo QR</button>
      </form>

      {qrDataUrl ? (
        <div className="mt-5 rounded-2xl border border-chem-border bg-white p-5 shadow-card">
          <img src={qrDataUrl} alt="QR Code" className="h-60 w-60" />
          <a href={qrDataUrl} download="chemplay-qr.png" className="mt-3 inline-block rounded-xl border px-4 py-2">
            Tải PNG
          </a>
        </div>
      ) : null}
    </main>
  );
}
