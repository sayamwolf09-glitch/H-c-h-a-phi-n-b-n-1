export default function ClassManagementPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-chem-primary">Quản lý lớp học</h1>
      <div className="mt-5 rounded-2xl border border-chem-border bg-white p-4 shadow-card">
        <div className="mb-3 flex flex-wrap gap-2">
          <input className="rounded-xl border p-2" placeholder="Tìm lớp..." />
          <button className="rounded-xl bg-chem-primary px-4 py-2 text-white">Tạo lớp mới</button>
        </div>
        <p className="text-sm text-chem-muted">Danh sách lớp sẽ được tải từ API /api/classes.</p>
      </div>
    </main>
  );
}
