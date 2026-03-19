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
        "card-surface group relative h-full overflow-hidden p-4 transition duration-200 sm:p-5",
        selected ? "border-white/30 shadow-[0_24px_56px_rgba(111,169,255,0.18)]" : "border-white/10",
        className,
      )}
      onMouseDown={onSelect}
    >
      {editMode ? (
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-slate-950/70 via-slate-950/25 to-transparent px-3 pb-8 pt-3">
          <div className="widget-drag-handle inline-flex cursor-grab items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-300">
            <GripVertical className="h-3.5 w-3.5" />
            Move
          </div>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Remove widget"
            className="h-8 w-8 bg-slate-950/35 text-slate-300 hover:bg-rose-500/18 hover:text-rose-200"
            onClick={(event) => {
              event.stopPropagation();
              onRemove();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ) : null}

      <div className="relative h-full">{children}</div>
    </article>
  );
}
