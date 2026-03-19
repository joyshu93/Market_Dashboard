"use client";

import { GripVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface WidgetShellProps {
  widgetId: string;
  editMode: boolean;
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  children: React.ReactNode;
  className?: string;
}

export function WidgetShell({
  widgetId,
  editMode,
  selected,
  onSelect,
  onRemove,
  children,
  className,
}: WidgetShellProps) {
  return (
    <article
      data-widget-id={widgetId}
      className={cn(
        "card-surface group relative h-full overflow-hidden p-3 transition duration-200 sm:p-4",
        selected ? "border-white/30 shadow-[0_24px_56px_rgba(111,169,255,0.18)]" : "border-white/10",
        className,
      )}
      onMouseDown={onSelect}
    >
      {editMode ? (
        <div className="pointer-events-none absolute inset-x-3 top-3 z-20 flex items-start justify-between gap-3">
          <div className="widget-drag-handle pointer-events-auto inline-flex cursor-grab items-center gap-2 rounded-full border border-white/12 bg-slate-950/75 px-2.5 py-1.5 text-[11px] uppercase tracking-[0.18em] text-slate-200 shadow-[0_12px_24px_rgba(0,0,0,0.22)] backdrop-blur-md">
            <GripVertical className="h-3.5 w-3.5" />
            Move
          </div>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Remove widget"
            className="pointer-events-auto h-8 w-8 rounded-full border border-white/10 bg-slate-950/72 text-slate-300 shadow-[0_12px_24px_rgba(0,0,0,0.2)] backdrop-blur-md hover:bg-rose-500/18 hover:text-rose-200"
            onClick={(event) => {
              event.stopPropagation();
              onRemove();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ) : null}

      <div className={cn("relative flex h-full min-h-0 flex-col", editMode && "pt-10 sm:pt-11")}>
        {children}
      </div>
    </article>
  );
}
