"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { AddCardModal } from "@/components/dashboard/add-card-modal";
import { DashboardContextMenu } from "@/components/dashboard/context-menu";
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/dashboard-store";

export function DashboardShell() {
  const [hydrated, setHydrated] = useState(false);
  const {
    addCardModal,
    closeAddCardModal,
    closeContextMenu,
    contextMenu,
    openAddCardModal,
    openContextMenu,
    refreshMarketData,
    theme,
  } = useDashboardStore(
    useShallow((state) => ({
      addCardModal: state.addCardModal,
      closeAddCardModal: state.closeAddCardModal,
      closeContextMenu: state.closeContextMenu,
      contextMenu: state.contextMenu,
      openAddCardModal: state.openAddCardModal,
      openContextMenu: state.openContextMenu,
      refreshMarketData: state.refreshMarketData,
      theme: state.theme,
    })),
  );

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    void refreshMarketData();

    const refreshMs = Number(process.env.NEXT_PUBLIC_MARKET_REFRESH_MS ?? "300000");
    const intervalMs = Number.isFinite(refreshMs) && refreshMs >= 60_000 ? refreshMs : 300_000;
    const timer = window.setInterval(() => {
      void refreshMarketData();
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [refreshMarketData]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeContextMenu();
        closeAddCardModal();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;

      if (!target) {
        return;
      }

      if (target.closest("[data-context-menu]")) {
        return;
      }

      closeContextMenu();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("resize", closeContextMenu);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", closeContextMenu);
    };
  }, [closeAddCardModal, closeContextMenu]);

  if (!hydrated) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="card-surface-strong h-[260px] animate-pulse" />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card-surface h-[220px] animate-pulse" />
          <div className="card-surface h-[220px] animate-pulse" />
          <div className="card-surface h-[220px] animate-pulse" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <DashboardHeader />

      <section
        className="relative rounded-[34px] border border-white/8 bg-[rgba(7,11,18,0.36)] p-3 backdrop-blur-sm sm:p-4"
        onContextMenu={(event) => {
          const target = event.target as HTMLElement;

          if (
            target.closest("[data-widget-id]") ||
            target.closest("[data-no-dashboard-context]")
          ) {
            return;
          }

          event.preventDefault();
          openContextMenu({ x: event.clientX, y: event.clientY });
        }}
      >
        <div className="flex items-center justify-between gap-3 px-1 pb-4 sm:px-2">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Dashboard canvas
          </p>
          <p className="hidden text-xs text-slate-500 md:block">
            Right-click empty space to add a card or open layout actions.
          </p>
        </div>

        <DashboardGrid />
      </section>

      <Button
        variant="primary"
        size="icon"
        className="fixed bottom-6 right-6 z-30 h-14 w-14 shadow-[0_22px_44px_rgba(111,169,255,0.25)] md:hidden"
        onClick={() => openAddCardModal("mobile-fab")}
      >
        <Plus className="h-5 w-5" />
      </Button>

      {contextMenu.open ? <DashboardContextMenu x={contextMenu.x} y={contextMenu.y} /> : null}
      {addCardModal.open ? <AddCardModal /> : null}
    </main>
  );
}
