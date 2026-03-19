"use client";

import { useEffect, useRef, useState } from "react";
import { Responsive, WidthProvider, type Layout, type Layouts } from "react-grid-layout";
import { useShallow } from "zustand/react/shallow";

import { WidgetRenderer } from "@/components/widgets/widget-renderer";
import { getLayoutForWidget, normalizeDashboardLayouts } from "@/lib/utils/dashboard";
import {
  dashboardBreakpoints,
  dashboardCols,
} from "@/lib/widget-registry/widget-registry";
import { dashboardMargin, dashboardPadding, dashboardRowHeight } from "@/lib/utils/dashboard";
import { useDashboardStore } from "@/store/dashboard-store";
import type { BreakpointKey, DashboardLayouts, DashboardWidget } from "@/types/dashboard";

const ResponsiveGridLayout = WidthProvider(Responsive);

function normalizeLayouts(
  allLayouts: Layouts,
  existingLayouts: DashboardLayouts,
  widgets: DashboardWidget[],
): DashboardLayouts {
  const rawLayouts: DashboardLayouts = {
    lg: (allLayouts.lg ?? existingLayouts.lg).map((item) => ({
      i: item.i,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
      minW: item.minW,
      minH: item.minH,
      maxW: item.maxW,
      maxH: item.maxH,
    })),
    md: (allLayouts.md ?? existingLayouts.md).map((item) => ({
      i: item.i,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
      minW: item.minW,
      minH: item.minH,
      maxW: item.maxW,
      maxH: item.maxH,
    })),
    sm: (allLayouts.sm ?? existingLayouts.sm).map((item) => ({
      i: item.i,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
      minW: item.minW,
      minH: item.minH,
      maxW: item.maxW,
      maxH: item.maxH,
    })),
  };

  return normalizeDashboardLayouts(rawLayouts, widgets);
}

export function DashboardGrid() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const { activeBreakpoint, editMode, layouts, setActiveBreakpoint, updateLayouts, widgets } =
    useDashboardStore(
      useShallow((state) => ({
        activeBreakpoint: state.activeBreakpoint,
        editMode: state.editMode,
        layouts: state.layouts,
        setActiveBreakpoint: state.setActiveBreakpoint,
        updateLayouts: state.updateLayouts,
        widgets: state.widgets,
      })),
    );

  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      setContainerWidth(entry.contentRect.width);
    });

    observer.observe(element);
    setContainerWidth(element.clientWidth);

    return () => observer.disconnect();
  }, []);

  const activeCols = dashboardCols[activeBreakpoint];
  const calculatedTileSize =
    containerWidth > 0
      ? (containerWidth -
          dashboardPadding[0] * 2 -
          dashboardMargin[0] * Math.max(activeCols - 1, 0)) /
        activeCols
      : dashboardRowHeight;
  const squareRowHeight = Math.max(48, calculatedTileSize);

  return (
    <div ref={containerRef}>
      <ResponsiveGridLayout
        className="min-h-[720px]"
        layouts={layouts as unknown as Layouts}
        breakpoints={dashboardBreakpoints}
        cols={dashboardCols}
        margin={dashboardMargin}
        containerPadding={dashboardPadding}
        rowHeight={squareRowHeight}
        isDraggable={editMode}
        isResizable={editMode}
        draggableHandle=".widget-drag-handle"
        draggableCancel="button, input, textarea, a"
        resizeHandles={["se"]}
        measureBeforeMount={false}
        useCSSTransforms
        compactType="vertical"
        onLayoutChange={(_currentLayout: Layout[], nextLayouts: Layouts) =>
          updateLayouts(normalizeLayouts(nextLayouts, layouts, widgets))
        }
        onBreakpointChange={(breakpoint) =>
          setActiveBreakpoint((breakpoint as BreakpointKey) || "lg")
        }
      >
        {widgets.map((widget) => (
          <div key={widget.id}>
            <WidgetRenderer
              widget={widget}
              layout={getLayoutForWidget(layouts, widget.id, activeBreakpoint)}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
