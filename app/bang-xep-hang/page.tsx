import { Trophy } from "lucide-react";

const DATA = [
  { rank: 1, name: "Nguyễn Minh Anh", className: "8A1", score: 9.8 },
  { rank: 2, name: "Trần Gia Hân", className: "8A1", score: 9.5 },
  { rank: 3, name: "Phạm Tuấn Kiệt", className: "8A1", score: 9.2 },
  { rank: 4, name: "Lê Quốc Bảo", className: "8A2", score: 8.9 }
];

export default function RankingPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center gap-3">
        <Trophy className="text-yellow-500" />
        <h1 className="text-3xl font-bold text-chem-primary">Bảng xếp hạng</h1>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-chem-border bg-white shadow-card">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left">Hạng</th>
              <th className="px-4 py-3 text-left">Học sinh</th>
              <th className="px-4 py-3 text-left">Lớp</th>
              <th className="px-4 py-3 text-left">Điểm</th>
            </tr>
          </thead>
          <tbody>
            {DATA.map((row) => (
              <tr key={row.rank} className="border-t">
                <td className="px-4 py-3">#{row.rank}</td>
                <td className="px-4 py-3">{row.name}</td>
                <td className="px-4 py-3">{row.className}</td>
                <td className="px-4 py-3 font-semibold text-chem-primary">{row.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
