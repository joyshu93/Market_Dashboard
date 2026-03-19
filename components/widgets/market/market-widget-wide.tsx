import { Pill } from "@/components/ui/pill";
import { TrendChart } from "@/components/charts/trend-chart";
import { getToneClassName } from "@/lib/utils/format";
import type { MarketWidgetViewModel } from "@/components/widgets/market/market-widget-types";

interface MarketWidgetWideProps {
  model: MarketWidgetViewModel;
}

export function MarketWidgetWide({ model }: MarketWidgetWideProps) {
  return (
    <div className="grid h-full grid-cols-[minmax(0,1fr)_132px] gap-4">
      <div className="flex min-w-0 flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Pill label={model.instrument.category} tone="neutral" />
            <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
              {model.instrument.market}
            </span>
          </div>

          <div>
            <p className="text-sm font-medium text-white">{model.instrument.name}</p>
            <p className="mt-1 text-xs text-slate-400">{model.instrument.symbol}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-3xl font-semibold tracking-tight text-white">
            {model.formattedPrice}
          </p>
          <div className={`flex flex-wrap items-center gap-2 text-sm ${getToneClassName(model.trend)}`}>
            <span>{model.formattedChange}</span>
            <span>{model.formattedChangePct}</span>
          </div>
          <p className="line-clamp-2 text-xs leading-5 text-slate-400">{model.statusText}</p>
        </div>
      </div>

      <div className="flex flex-col justify-between">
        <div className="h-24 rounded-[24px] border border-white/6 bg-white/[0.03] p-2.5">
          <TrendChart points={model.sparkline} trend={model.trend} />
        </div>

        <div className="space-y-1 text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Last update</p>
          <p className="text-sm font-medium text-slate-200">{model.updatedAtTime}</p>
          <p className="text-xs text-slate-500">{model.updatedAtLabel}</p>
        </div>
      </div>
    </div>
  );
}
