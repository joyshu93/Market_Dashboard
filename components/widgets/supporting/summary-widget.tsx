import { Pill } from "@/components/ui/pill";
import { getToneClassName } from "@/lib/utils/format";
import type { SummaryCardData, SummarySessionKey } from "@/types/dashboard";

interface SummaryWidgetProps {
  data: SummaryCardData;
}

function getKoreaSession(): SummarySessionKey {
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  });
  const hour = Number(formatter.format(new Date()));

  if (hour < 9) {
    return "morning";
  }

  if (hour < 15) {
    return "intraday";
  }

  return "close";
}

export function SummaryWidget({ data }: SummaryWidgetProps) {
  const activeSession = getKoreaSession();
  const activeData = data.sessionVariants?.[activeSession]
    ? {
        ...data,
        ...data.sessionVariants[activeSession],
      }
    : data;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Pill label={activeData.subtitle} tone="default" />
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
            {activeData.sessionLabel ? <span>{activeData.sessionLabel}</span> : null}
            {activeData.updatedAtLabel ? <span>{activeData.updatedAtLabel}</span> : null}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-white">{activeData.title}</h3>
          {activeData.posture ? (
            <div className="mt-3 rounded-[20px] border border-white/8 bg-white/[0.05] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                {activeData.posture.label}
              </p>
              <p
                className={`mt-2 text-base font-semibold ${
                  activeData.posture.tone ? getToneClassName(activeData.posture.tone) : "text-white"
                }`}
              >
                {activeData.posture.message}
              </p>
            </div>
          ) : null}
          <p className="mt-3 line-clamp-3 max-w-2xl text-sm leading-6 text-slate-300">
            {activeData.summary}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {activeData.stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[20px] border border-white/8 bg-white/[0.04] px-3 py-3"
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

      <div className="flex-1 space-y-2 overflow-hidden">
        {activeData.highlights.map((highlight) => (
          <div
            key={highlight}
            className="line-clamp-2 rounded-[18px] border border-white/8 bg-white/[0.03] px-3 py-3 text-sm leading-6 text-slate-300"
          >
            {highlight}
          </div>
        ))}
      </div>
    </div>
  );
}
