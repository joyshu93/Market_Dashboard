"use client";

import { Lock, MoonStar, PencilLine, Plus } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/dashboard-store";

export function DashboardHeader() {
  const {
    editMode,
    marketDataMeta,
    openAddCardModal,
    setTheme,
    theme,
    toggleEditMode,
  } = useDashboardStore(
    useShallow((state) => ({
      editMode: state.editMode,
      marketDataMeta: state.marketDataMeta,
      openAddCardModal: state.openAddCardModal,
      setTheme: state.setTheme,
      theme: state.theme,
      toggleEditMode: state.toggleEditMode,
    })),
  );

  const now = new Date();
  const todayLabel = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
  const hour = now.getHours();
  const sessionLabel =
    hour < 9 ? "Before open" : hour < 15.5 ? "Intraday" : "After close";
  const updatedAtLabel = marketDataMeta?.fetchedAt
    ? new Date(marketDataMeta.fetchedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Mock data";

  return (
    <header className="relative min-h-[108px]">
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

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-center lg:justify-start lg:text-left">
        <div className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Today</p>
          <p className="mt-1 text-sm font-medium text-slate-200">{todayLabel}</p>
        </div>
        <div className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Session</p>
          <p className="mt-1 text-sm font-medium text-slate-200">{sessionLabel}</p>
        </div>
        <div className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Last updated</p>
          <p className="mt-1 text-sm font-medium text-slate-200">{updatedAtLabel}</p>
        </div>
      </div>
    </header>
  );
}
