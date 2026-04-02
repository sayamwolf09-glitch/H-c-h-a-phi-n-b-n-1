export default function QuestionBankPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-chem-primary">Ngân hàng câu hỏi</h1>
      <div className="mt-5 rounded-2xl border border-chem-border bg-white p-4 shadow-card">
        <div className="flex flex-wrap gap-2">
          <select className="rounded-xl border p-2">
            <option>Loại câu hỏi</option>
          </select>
          <select className="rounded-xl border p-2">
            <option>Khối</option>
          </select>
          <button className="rounded-xl bg-chem-accent px-4 py-2 text-white">Thêm câu hỏi</button>
        </div>
      </div>
    </main>
  );
}
