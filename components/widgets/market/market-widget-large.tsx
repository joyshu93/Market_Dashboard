import { Pill } from "@/components/ui/pill";
import { TrendChart } from "@/components/charts/trend-chart";
import { getToneClassName } from "@/lib/utils/format";
import type { MarketWidgetViewModel } from "@/components/widgets/market/market-widget-types";

interface MarketWidgetLargeProps {
  model: MarketWidgetViewModel;
}

export function MarketWidgetLarge({ model }: MarketWidgetLargeProps) {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Pill label={model.instrument.category} tone="neutral" />
            <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
              {model.instrument.market}
            </span>
          </div>

          <div>
            <p className="text-base font-medium text-white">{model.instrument.name}</p>
            <p className="mt-1 text-xs text-slate-400">{model.instrument.symbol}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-3xl font-semibold tracking-tight text-white">
            {model.formattedPrice}
          </p>
          <div className={`mt-2 flex items-center justify-end gap-2 text-sm ${getToneClassName(model.trend)}`}>
            <span>{model.formattedChange}</span>
            <span>{model.formattedChangePct}</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">{model.updatedAtLabel}</p>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-[minmax(0,1.35fr)_minmax(200px,0.95fr)] gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(220px,0.9fr)]">
        <div className="flex flex-col gap-3 rounded-[26px] border border-white/8 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Intraday tone</p>
              <p className="mt-1 text-sm text-slate-300">{model.statusText}</p>
            </div>
            <Pill label="1D mock" tone="default" />
          </div>

          <div className="min-h-[148px] flex-1">
            <TrendChart points={model.detailSeries} trend={model.trend} variant="detail" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            {model.extraMetrics.slice(0, 4).map((metric) => (
              <div
                key={metric.label}
                className="rounded-[22px] border border-white/8 bg-white/[0.04] px-4 py-3"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  {metric.label}
                </p>
                <p
                  className={`mt-2 text-sm font-medium ${
                    metric.tone ? getToneClassName(metric.tone) : "text-white"
                  }`}
                >
                  {metric.value}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Quick take
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{model.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
