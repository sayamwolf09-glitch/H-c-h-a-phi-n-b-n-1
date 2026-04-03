import { StatCard } from "@/components/common/stat-card";

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-chem-primary">Dashboard Admin</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tổng lớp" value={18} />
        <StatCard label="Tổng học sinh" value={732} />
        <StatCard label="Lượt làm hôm nay" value={286} />
        <StatCard label="Tỷ lệ hoàn thành" value="91%" />
      </div>
    </main>
  );
}
