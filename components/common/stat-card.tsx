type Props = {
  label: string;
  value: string | number;
  subText?: string;
};

export function StatCard({ label, value, subText }: Props) {
  return (
    <div className="rounded-2xl border border-chem-border chem-glass p-4 shadow-card transition hover:-translate-y-1">
      <p className="text-sm text-chem-muted">{label}</p>
      <p className="chem-gradient-text mt-2 text-2xl font-extrabold">{value}</p>
      {subText ? <p className="mt-1 text-xs text-chem-muted">{subText}</p> : null}
    </div>
  );
}
