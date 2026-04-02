import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "ChemPlay Classroom - Học Hóa cùng cô Hằng",
  description: "Nền tảng trò chơi học tập trực tuyến cho THCS, ưu tiên môn Hóa học."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-chem-background text-chem-text antialiased">
        <div className="pointer-events-none fixed inset-0 -z-10 chem-hero-grid" />
        {children}
      </body>
    </html>
  );
}
