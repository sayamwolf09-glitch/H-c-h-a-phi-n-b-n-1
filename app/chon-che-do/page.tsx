import { ModeCard } from "@/components/common/mode-card";

export default function ModeSelectPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-chem-primary md:text-4xl">Chọn chế độ học tập</h1>
      <p className="mt-2 text-chem-muted">Hãy chọn chế độ phù hợp với mục tiêu học tập của em.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <ModeCard
          title="Sân chơi tự do"
          description="Nhập tên, chọn lớp và chơi không giới hạn lượt, không giới hạn thời gian."
          href="/san-choi-tu-do"
          colorClass="hover:border-cyan-300"
        />
        <ModeCard
          title="Vào thi"
          description="Xác thực tên đúng danh sách lớp, áp dụng quy tắc thi nghiêm túc."
          href="/vao-thi"
          colorClass="hover:border-blue-300"
        />
      </div>
    </main>
  );
}
