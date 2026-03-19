"use client";

import { Lock, MoonStar, PencilLine, Plus, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/dashboard-store";

export function DashboardHeader() {
  const { editMode, openAddCardModal, theme, toggleEditMode, widgets } = useDashboardStore(
    (state) => ({
      editMode: state.editMode,
      openAddCardModal: state.openAddCardModal,
      theme: state.theme,
      toggleEditMode: state.toggleEditMode,
      widgets: state.widgets,
    }),
  );

  const marketCardCount = widgets.filter((widget) => widget.widgetType === "market").length;

  return (
    <header className="card-surface-strong relative overflow-hidden p-6 sm:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(111,169,255,0.14),transparent_38%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.08),transparent_22%)]" />

      <div className="relative flex flex-col gap-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
              <Sparkles className="h-3.5 w-3.5" />
              Market Home
            </div>

            <div>
              <h1 className="font-serif text-4xl tracking-tight text-white sm:text-5xl">
                Arrange markets like a home screen, not a trading terminal.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Universal cards let the same instrument scale from glanceable to detailed.
                Right-click empty space on desktop or use the add action to place new cards.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={() => openAddCardModal("header")}>
              <Plus className="h-4 w-4" />
              Add card
            </Button>

            <Button
              variant={editMode ? "primary" : "secondary"}
              onClick={toggleEditMode}
            >
              {editMode ? <Lock className="h-4 w-4" /> : <PencilLine className="h-4 w-4" />}
              {editMode ? "Lock layout" : "Edit layout"}
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[24px] border border-white/8 bg-white/[0.04] px-4 py-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
              <MoonStar className="h-3.5 w-3.5" />
              Theme
            </div>
            <p className="mt-3 text-xl font-semibold text-white">
              {theme === "dark" ? "Dark" : theme}
            </p>
          </div>

          <div className="rounded-[24px] border border-white/8 bg-white/[0.04] px-4 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Tracked cards</p>
            <p className="mt-3 text-xl font-semibold text-white">{marketCardCount} markets</p>
          </div>

          <div className="rounded-[24px] border border-white/8 bg-white/[0.04] px-4 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Persistence</p>
            <p className="mt-3 text-xl font-semibold text-white">Saved locally</p>
          </div>
        </div>
      </div>
    </header>
  );
}
