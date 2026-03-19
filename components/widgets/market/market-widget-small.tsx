import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { Pill } from "@/components/ui/pill";
import { getToneClassName } from "@/lib/utils/format";
import type { MarketWidgetViewModel } from "@/components/widgets/market/market-widget-types";

interface MarketWidgetSmallProps {
  model: MarketWidgetViewModel;
}

export function MarketWidgetSmall({ model }: MarketWidgetSmallProps) {
  const TrendIcon =
    model.trend === "up" ? ArrowUpRight : model.trend === "down" ? ArrowDownRight : Minus;

  return (
    <div className="flex h-full flex-col justify-between gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <Pill label={model.instrument.category} tone="neutral" />
          <div>
            <p className="text-sm font-medium text-white">{model.instrument.symbol}</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">{model.instrument.market}</p>
          </div>
        </div>

        <div
          className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/[0.05] ${getToneClassName(model.trend)}`}
        >
          <TrendIcon className="h-4 w-4" />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-2xl font-semibold tracking-tight text-white">
          {model.formattedPrice}
        </p>
        <div className={`flex items-center gap-2 text-sm ${getToneClassName(model.trend)}`}>
          <span>{model.formattedChange}</span>
          <span>{model.formattedChangePct}</span>
        </div>
      </div>
    </div>
  );
}
