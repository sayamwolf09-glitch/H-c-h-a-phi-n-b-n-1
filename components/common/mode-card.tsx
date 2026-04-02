import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = {
  title: string;
  description: string;
  href: string;
  colorClass: string;
};

export function ModeCard({ title, description, href, colorClass }: Props) {
  return (
    <Link
      href={href}
      className={`group block rounded-3xl border border-chem-border chem-glass p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-xl ${colorClass}`}
    >
      <div className="mb-2 h-1 w-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
      <h3 className="text-2xl font-bold text-chem-text">{title}</h3>
      <p className="mt-2 text-sm text-chem-muted">{description}</p>
      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-chem-primary">
        Bắt đầu <ArrowRight size={16} className="transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
