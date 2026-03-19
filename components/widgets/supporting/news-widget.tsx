import { formatUpdatedAt, getToneClassName } from "@/lib/utils/format";
import type { NewsFeedData } from "@/types/dashboard";

interface NewsWidgetProps {
  data: NewsFeedData;
}

export function NewsWidget({ data }: NewsWidgetProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{data.subtitle}</p>
        <h3 className="mt-2 text-xl font-semibold text-white">{data.title}</h3>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
        {data.items.map((item) => (
          <article
            key={item.id}
            className="rounded-[20px] border border-white/8 bg-white/[0.03] px-3 py-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex h-2.5 w-2.5 rounded-full ${getToneClassName(item.sentiment)}`}
                />
                <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  {item.source}
                </span>
              </div>
              <span className="text-xs text-slate-500">{formatUpdatedAt(item.publishedAt)}</span>
            </div>

            <p className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-white">
              {item.title}
            </p>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{item.summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
