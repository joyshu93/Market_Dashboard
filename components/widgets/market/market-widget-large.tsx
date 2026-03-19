import { Pill } from "@/components/ui/pill";
import { TrendChart } from "@/components/charts/trend-chart";
import { getToneClassName } from "@/lib/utils/format";
import type { MarketWidgetViewModel } from "@/components/widgets/market/market-widget-types";

interface MarketWidgetLargeProps {
  model: MarketWidgetViewModel;
}

export function MarketWidgetLarge({ model }: MarketWidgetLargeProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Pill label={model.instrument.category} tone="neutral" />
            <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
              {model.instrument.market}
            </span>
          </div>

          <div className="min-w-0">
            <p className="line-clamp-2 text-base font-medium text-white">{model.instrument.name}</p>
            <p className="mt-1 text-xs text-slate-400">{model.instrument.symbol}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="truncate text-[clamp(1.6rem,2.4vw,2rem)] font-semibold tracking-tight text-white">
            {model.formattedPrice}
          </p>
          <div className={`mt-2 flex items-center justify-end gap-2 text-sm ${getToneClassName(model.trend)}`}>
            <span>{model.formattedChange}</span>
            <span>{model.formattedChangePct}</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">{model.updatedAtLabel}</p>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <div className="flex min-h-0 flex-1 flex-col gap-3 rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Intraday tone</p>
              <p className="mt-1 line-clamp-2 text-sm text-slate-300">{model.statusText}</p>
            </div>
            <Pill label="1D mock" tone="default" />
          </div>

          <div className="min-h-[132px] flex-1">
            <TrendChart points={model.detailSeries} trend={model.trend} variant="detail" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {model.extraMetrics.slice(0, 4).map((metric) => (
            <div
              key={metric.label}
              className="rounded-[20px] border border-white/8 bg-white/[0.04] px-3 py-3"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                {metric.label}
              </p>
              <p
                className={`mt-2 truncate text-sm font-medium ${
                  metric.tone ? getToneClassName(metric.tone) : "text-white"
                }`}
              >
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Quick take</p>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">{model.summary}</p>
        </div>
      </div>
    </div>
  );
}
