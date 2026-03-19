"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { instruments, marketSnapshots } from "@/lib/mock/market-data";
import { adCards, newsFeeds, summaryCards } from "@/lib/mock/supporting-data";
import {
  appendWidgetLayouts,
  createDefaultDashboardSeed,
  createMarketWidget,
  createSupportingWidgetFromTemplate,
  removeWidgetLayouts,
} from "@/lib/utils/dashboard";
import type {
  AddCardModalState,
  AdCardData,
  BreakpointKey,
  ContextMenuState,
  DashboardLayouts,
  DashboardWidget,
  Instrument,
  MarketSnapshot,
  NewsFeedData,
  SummaryCardData,
  ThemeMode,
} from "@/types/dashboard";

const defaultSeed = createDefaultDashboardSeed();

const instrumentRecord = Object.fromEntries(
  instruments.map((instrument) => [instrument.id, instrument]),
) as Record<string, Instrument>;

const initialAddCardModal: AddCardModalState = {
  open: false,
};

const initialContextMenu: ContextMenuState = {
  open: false,
  x: 0,
  y: 0,
};

interface DashboardPersistedState {
  widgets: DashboardWidget[];
  layouts: DashboardLayouts;
  editMode: boolean;
  theme: ThemeMode;
}

interface DashboardState extends DashboardPersistedState {
  instruments: Instrument[];
  instrumentsById: Record<string, Instrument>;
  snapshotsByInstrumentId: Record<string, MarketSnapshot>;
  summaryCards: Record<string, SummaryCardData>;
  newsFeeds: Record<string, NewsFeedData>;
  adCards: Record<string, AdCardData>;
  selectedWidgetId: string | null;
  activeBreakpoint: BreakpointKey;
  addCardModal: AddCardModalState;
  contextMenu: ContextMenuState;
  toggleEditMode: () => void;
  setTheme: (theme: ThemeMode) => void;
  setActiveBreakpoint: (breakpoint: BreakpointKey) => void;
  selectWidget: (widgetId: string | null) => void;
  updateLayouts: (layouts: DashboardLayouts) => void;
  openAddCardModal: (
    source: AddCardModalState["source"],
    anchor?: AddCardModalState["anchor"],
  ) => void;
  closeAddCardModal: () => void;
  openContextMenu: (position: Pick<ContextMenuState, "x" | "y">) => void;
  closeContextMenu: () => void;
  addMarketWidget: (instrumentId: string) => void;
  addSupportingWidget: (templateId: string) => void;
  removeWidget: (widgetId: string) => void;
}

const baseState: DashboardPersistedState = {
  widgets: defaultSeed.widgets,
  layouts: defaultSeed.layouts,
  editMode: false,
  theme: "dark",
};

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      ...baseState,
      instruments,
      instrumentsById: instrumentRecord,
      snapshotsByInstrumentId: marketSnapshots,
      summaryCards,
      newsFeeds,
      adCards,
      selectedWidgetId: null,
      activeBreakpoint: "lg",
      addCardModal: initialAddCardModal,
      contextMenu: initialContextMenu,
      toggleEditMode: () =>
        set((state) => ({
          editMode: !state.editMode,
          selectedWidgetId: !state.editMode ? state.selectedWidgetId : null,
        })),
      setTheme: (theme) => set({ theme }),
      setActiveBreakpoint: (activeBreakpoint) => set({ activeBreakpoint }),
      selectWidget: (selectedWidgetId) => set({ selectedWidgetId }),
      updateLayouts: (layouts) => set({ layouts }),
      openAddCardModal: (source, anchor) =>
        set({
          addCardModal: {
            open: true,
            source,
            anchor,
          },
          contextMenu: initialContextMenu,
        }),
      closeAddCardModal: () =>
        set({
          addCardModal: initialAddCardModal,
        }),
      openContextMenu: ({ x, y }) =>
        set({
          contextMenu: {
            open: true,
            source: "dashboard-empty-space",
            x,
            y,
          },
        }),
      closeContextMenu: () =>
        set({
          contextMenu: initialContextMenu,
        }),
      addMarketWidget: (instrumentId) => {
        const widget = createMarketWidget(instrumentId);
        const nextLayouts = appendWidgetLayouts(get().layouts, widget.widgetType, widget.id);

        set((state) => ({
          widgets: [...state.widgets, widget],
          layouts: nextLayouts,
          selectedWidgetId: widget.id,
          addCardModal: initialAddCardModal,
          contextMenu: initialContextMenu,
        }));
      },
      addSupportingWidget: (templateId) => {
        const widget = createSupportingWidgetFromTemplate(templateId);
        const nextLayouts = appendWidgetLayouts(get().layouts, widget.widgetType, widget.id);

        set((state) => ({
          widgets: [...state.widgets, widget],
          layouts: nextLayouts,
          selectedWidgetId: widget.id,
          addCardModal: initialAddCardModal,
          contextMenu: initialContextMenu,
        }));
      },
      removeWidget: (widgetId) =>
        set((state) => ({
          widgets: state.widgets.filter((widget) => widget.id !== widgetId),
          layouts: removeWidgetLayouts(state.layouts, widgetId),
          selectedWidgetId:
            state.selectedWidgetId === widgetId ? null : state.selectedWidgetId,
        })),
    }),
    {
      name: "market-home-dashboard-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        widgets: state.widgets,
        layouts: state.layouts,
        editMode: state.editMode,
        theme: state.theme,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as Partial<DashboardPersistedState>),
        addCardModal: initialAddCardModal,
        contextMenu: initialContextMenu,
        selectedWidgetId: null,
        activeBreakpoint: "lg",
      }),
    },
  ),
);
