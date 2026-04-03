import { StatCard } from "@/components/common/stat-card";

export default function TeacherDashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-chem-primary">Dashboard Giáo viên</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Lớp phụ trách" value={4} />
        <StatCard label="Học sinh đã làm" value={136} />
        <StatCard label="Học sinh chưa làm" value={21} />
        <StatCard label="Điểm TB" value={8.1} />
      </div>
    </main>
  );
}
