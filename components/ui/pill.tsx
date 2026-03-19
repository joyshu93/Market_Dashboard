import { cn } from "@/lib/utils/cn";

interface PillProps {
  label: string;
  tone?: "default" | "positive" | "negative" | "neutral";
  className?: string;
}

const toneClasses = {
  default: "bg-white/[0.07] text-slate-200",
  positive: "bg-emerald-400/12 text-emerald-300",
  negative: "bg-rose-400/12 text-rose-300",
  neutral: "bg-slate-500/15 text-slate-300",
};

export function Pill({ label, tone = "default", className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em]",
        toneClasses[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
