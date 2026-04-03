export default function TeacherStudentsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-chem-primary">Quản lý học sinh</h1>
      <div className="mt-5 rounded-2xl border border-chem-border bg-white p-4 shadow-card">
        <div className="flex flex-wrap gap-2">
          <select className="rounded-xl border p-2">
            <option>Chọn lớp</option>
          </select>
          <input className="rounded-xl border p-2" placeholder="Tìm học sinh..." />
          <button className="rounded-xl bg-chem-primary px-4 py-2 text-white">Thêm học sinh</button>
        </div>
      </div>
    </main>
  );
}
