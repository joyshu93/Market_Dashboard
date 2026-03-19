"use client";

import { Responsive, WidthProvider, type Layout, type Layouts } from "react-grid-layout";

import { WidgetRenderer } from "@/components/widgets/widget-renderer";
import { getLayoutForWidget } from "@/lib/utils/dashboard";
import {
  dashboardBreakpoints,
  dashboardCols,
} from "@/lib/widget-registry/widget-registry";
import { dashboardMargin, dashboardPadding, dashboardRowHeight } from "@/lib/utils/dashboard";
import { useDashboardStore } from "@/store/dashboard-store";
import type { BreakpointKey, DashboardLayouts } from "@/types/dashboard";

const ResponsiveGridLayout = WidthProvider(Responsive);

function normalizeLayouts(allLayouts: Layouts, existingLayouts: DashboardLayouts): DashboardLayouts {
  return {
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
}

export function DashboardGrid() {
  const { activeBreakpoint, editMode, layouts, setActiveBreakpoint, updateLayouts, widgets } =
    useDashboardStore((state) => ({
      activeBreakpoint: state.activeBreakpoint,
      editMode: state.editMode,
      layouts: state.layouts,
      setActiveBreakpoint: state.setActiveBreakpoint,
      updateLayouts: state.updateLayouts,
      widgets: state.widgets,
    }));

  return (
    <ResponsiveGridLayout
      className="min-h-[720px]"
      layouts={layouts as unknown as Layouts}
      breakpoints={dashboardBreakpoints}
      cols={dashboardCols}
      margin={dashboardMargin}
      containerPadding={dashboardPadding}
      rowHeight={dashboardRowHeight}
      isDraggable={editMode}
      isResizable={editMode}
      draggableHandle=".widget-drag-handle"
      draggableCancel="button, input, textarea, a"
      resizeHandles={["se"]}
      measureBeforeMount={false}
      useCSSTransforms
      compactType="vertical"
      onLayoutChange={(_currentLayout: Layout[], nextLayouts: Layouts) =>
        updateLayouts(normalizeLayouts(nextLayouts, layouts))
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
  );
}
