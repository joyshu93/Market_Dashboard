import { Pill } from "@/components/ui/pill";
import { getToneClassName } from "@/lib/utils/format";
import type { SummaryCardData } from "@/types/dashboard";

interface SummaryWidgetProps {
  data: SummaryCardData;
}

export function SummaryWidget({ data }: SummaryWidgetProps) {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="space-y-3">
        <Pill label={data.subtitle} tone="default" />
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-white">{data.title}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{data.summary}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {data.stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[22px] border border-white/8 bg-white/[0.04] px-4 py-3"
          >
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              {stat.label}
            </p>
            <p
              className={`mt-2 text-lg font-semibold ${
                stat.tone ? getToneClassName(stat.tone) : "text-white"
              }`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {data.highlights.map((highlight) => (
          <div
            key={highlight}
            className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-slate-300"
          >
            {highlight}
          </div>
        ))}
      </div>
    </div>
  );
}
