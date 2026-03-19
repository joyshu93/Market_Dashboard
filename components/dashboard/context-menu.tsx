"use client";

import { LayoutGrid, PencilLine, Plus } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { useDashboardStore } from "@/store/dashboard-store";

interface DashboardContextMenuProps {
  x: number;
  y: number;
}

export function DashboardContextMenu({ x, y }: DashboardContextMenuProps) {
  const { closeContextMenu, editMode, openAddCardModal, toggleEditMode } = useDashboardStore(
    useShallow((state) => ({
      closeContextMenu: state.closeContextMenu,
      editMode: state.editMode,
      openAddCardModal: state.openAddCardModal,
      toggleEditMode: state.toggleEditMode,
    })),
  );

  return (
    <div
      data-context-menu
      data-no-dashboard-context
      className="fixed z-40 min-w-[220px] rounded-[24px] border border-white/10 bg-[rgba(12,19,30,0.95)] p-2 shadow-[0_24px_60px_rgba(2,6,18,0.45)] backdrop-blur-xl"
      style={{ left: x, top: y }}
    >
      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left text-sm text-slate-200 transition hover:bg-white/[0.06]"
        onClick={() => {
          openAddCardModal("context-menu", { x, y });
        }}
      >
        <Plus className="h-4 w-4 text-slate-400" />
        Add card
      </button>

      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left text-sm text-slate-200 transition hover:bg-white/[0.06]"
        onClick={() => {
          toggleEditMode();
          closeContextMenu();
        }}
      >
        <PencilLine className="h-4 w-4 text-slate-400" />
        {editMode ? "Lock layout" : "Edit layout"}
      </button>

      <div className="mt-1 rounded-[18px] border border-white/6 bg-white/[0.03] px-3 py-3">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
          <LayoutGrid className="h-3.5 w-3.5" />
          Empty space
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-400">
          Cards insert at the bottom of the current layout and keep responsive defaults for each breakpoint.
        </p>
      </div>
    </div>
  );
}
