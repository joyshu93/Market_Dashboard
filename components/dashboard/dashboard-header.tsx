"use client";

import { Lock, MoonStar, PencilLine, Plus } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/dashboard-store";

export function DashboardHeader() {
  const { editMode, openAddCardModal, setTheme, theme, toggleEditMode } = useDashboardStore(
    useShallow((state) => ({
      editMode: state.editMode,
      openAddCardModal: state.openAddCardModal,
      setTheme: state.setTheme,
      theme: state.theme,
      toggleEditMode: state.toggleEditMode,
    })),
  );

  return (
    <header className="relative min-h-[72px]">
      <div className="flex justify-center">
        <div className="pointer-events-none rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-center text-xs font-medium uppercase tracking-[0.28em] text-slate-300">
          Market Home
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 lg:absolute lg:right-0 lg:top-0 lg:mt-0 lg:justify-end">
        <button
          type="button"
          aria-pressed={theme === "dark"}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.1]"
        >
          <span
            className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition ${
              theme === "dark"
                ? "bg-white text-slate-950"
                : "bg-white/[0.08] text-slate-200"
            }`}
          >
            <MoonStar className="h-4 w-4" />
          </span>
          {theme === "dark" ? "Dark" : "Light"}
        </button>

        <Button variant="secondary" onClick={() => openAddCardModal("header")}>
          <Plus className="h-4 w-4" />
          Add card
        </Button>

        <Button variant={editMode ? "primary" : "secondary"} onClick={toggleEditMode}>
          {editMode ? <Lock className="h-4 w-4" /> : <PencilLine className="h-4 w-4" />}
          {editMode ? "Lock layout" : "Edit layout"}
        </Button>
      </div>
    </header>
  );
}
