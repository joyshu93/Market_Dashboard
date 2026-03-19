import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import type { AdCardData } from "@/types/dashboard";

interface AdWidgetProps {
  data: AdCardData;
}

export function AdWidget({ data }: AdWidgetProps) {
  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-4 bg-[radial-gradient(circle_at_top_right,rgba(111,169,255,0.18),transparent_44%)]">
      <div className="min-w-0 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Pill label={data.eyebrow} tone="default" />
          <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
            {data.sponsor}
          </span>
        </div>

        <div>
          <h3 className="line-clamp-2 max-w-xl text-xl font-semibold leading-8 text-white">
            {data.title}
          </h3>
          <p className="mt-3 line-clamp-3 max-w-xl text-sm leading-6 text-slate-300">
            {data.message}
          </p>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4">
        <p className="line-clamp-2 max-w-sm text-xs leading-5 text-slate-500">{data.note}</p>

        <Button variant="secondary" className="shrink-0">
          {data.ctaLabel}
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
