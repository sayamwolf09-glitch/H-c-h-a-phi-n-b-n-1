import Link from "next/link";
import { FlaskConical, QrCode, Trophy } from "lucide-react";
import { AudioControlBar } from "@/components/common/audio-control-bar";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-8 text-white shadow-card md:p-10">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/20 blur-xl animate-pulse-soft" />
        <div className="pointer-events-none absolute -bottom-10 left-10 h-36 w-36 rounded-full bg-cyan-200/30 blur-xl animate-float-soft" />

        <p className="inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold md:text-sm">
          ⚗️ Học Hóa theo phong cách game hóa hiện đại
        </p>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-5xl">ChemPlay Classroom - Học Hóa cùng cô Hằng</h1>
        <p className="mt-4 max-w-3xl text-sm text-blue-50 md:text-base">
          Nền tảng trò chơi học tập trực tuyến cho học sinh THCS, ưu tiên môn Hóa học với trải nghiệm hiện đại, sinh động.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/chon-che-do" className="rounded-xl bg-white px-5 py-3 font-semibold text-chem-primary transition hover:-translate-y-0.5">
            Vào chơi ngay
          </Link>
          <Link href="/dang-nhap" className="rounded-xl border border-white px-5 py-3 font-semibold transition hover:bg-white/10">
            Đăng nhập giáo viên / admin
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="chem-glass rounded-2xl border border-chem-border p-5 shadow-card transition hover:-translate-y-1">
          <FlaskConical className="text-chem-primary" />
          <h3 className="mt-2 font-bold">Nhiều loại câu hỏi</h3>
          <p className="text-sm text-chem-muted">Trắc nghiệm, nối cặp, điền từ, điền bảng, video, tự luận ngắn.</p>
        </div>
        <div className="chem-glass rounded-2xl border border-chem-border p-5 shadow-card transition hover:-translate-y-1">
          <Trophy className="text-chem-accent" />
          <h3 className="mt-2 font-bold">Bảng xếp hạng theo lớp/khối</h3>
          <p className="text-sm text-chem-muted">Theo dõi tiến bộ, tạo động lực học tập tích cực.</p>
        </div>
        <div className="chem-glass rounded-2xl border border-chem-border p-5 shadow-card transition hover:-translate-y-1">
          <QrCode className="text-chem-secondary" />
          <h3 className="mt-2 font-bold">QR truy cập nhanh</h3>
          <p className="text-sm text-chem-muted">Vào lớp học chỉ trong vài giây qua mã QR.</p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-chem-border chem-glass p-4">
        <p className="mb-3 text-sm font-semibold text-chem-muted">🎵 Không khí lớp học</p>
        <AudioControlBar />
      </section>
    </main>
  );
}
