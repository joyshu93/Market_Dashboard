"use client";

import { useDeferredValue, useState } from "react";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Pill } from "@/components/ui/pill";
import { supportingWidgetTemplates } from "@/lib/mock/supporting-data";
import { buildInstrumentSearchText } from "@/lib/utils/dashboard";
import { formatInstrumentValue, formatSignedPercent, getTrend, getToneClassName } from "@/lib/utils/format";
import { useDashboardStore } from "@/store/dashboard-store";

export function AddCardModal() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const {
    addCardModal,
    addMarketWidget,
    addSupportingWidget,
    closeAddCardModal,
    instruments,
    snapshotsByInstrumentId,
  } = useDashboardStore((state) => ({
    addCardModal: state.addCardModal,
    addMarketWidget: state.addMarketWidget,
    addSupportingWidget: state.addSupportingWidget,
    closeAddCardModal: state.closeAddCardModal,
    instruments: state.instruments,
    snapshotsByInstrumentId: state.snapshotsByInstrumentId,
  }));

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredInstruments = instruments.filter((instrument) =>
    buildInstrumentSearchText(instrument.name, instrument.symbol, instrument.tags).includes(
      normalizedQuery,
    ),
  );

  return (
    <Modal
      open={addCardModal.open}
      title="Add a card"
      description="Search for a market instrument only when you need it. Supporting cards stay separate so market instruments can remain universal."
      onClose={closeAddCardModal}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <label className="block">
            <span className="sr-only">Search instruments</span>
            <div className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search KOSPI, USD/KRW, Gold, BTC..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>
          </label>

          <div className="mt-5 max-h-[440px] space-y-3 overflow-y-auto pr-1">
            {filteredInstruments.map((instrument) => {
              const snapshot = snapshotsByInstrumentId[instrument.id];
              const trend = getTrend(snapshot.change);

              return (
                <button
                  key={instrument.id}
                  type="button"
                  className="flex w-full items-center justify-between gap-4 rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-4 text-left transition hover:border-white/16 hover:bg-white/[0.05]"
                  onClick={() => addMarketWidget(instrument.id)}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Pill label={instrument.category} tone="neutral" />
                      <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        {instrument.market}
                      </span>
                    </div>

                    <p className="mt-3 text-sm font-medium text-white">{instrument.name}</p>
                    <p className="mt-1 text-xs text-slate-400">{instrument.symbol}</p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-white">
                      {formatInstrumentValue(snapshot.price, instrument)}
                    </p>
                    <p className={`mt-1 text-xs ${getToneClassName(trend)}`}>
                      {formatSignedPercent(snapshot.changePct)}
                    </p>
                  </div>
                </button>
              );
            })}

            {filteredInstruments.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] px-4 py-10 text-center text-sm text-slate-400">
                No instruments matched that search yet. Try a symbol, name, or market keyword.
              </div>
            ) : null}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[26px] border border-white/8 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Supporting cards
            </p>
            <div className="mt-4 space-y-3">
              {supportingWidgetTemplates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  className="w-full rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 text-left transition hover:border-white/16 hover:bg-white/[0.05]"
                  onClick={() => addSupportingWidget(template.id)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{template.label}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {template.description}
                      </p>
                    </div>
                    <Plus className="h-4 w-4 shrink-0 text-slate-500" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[26px] border border-white/8 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Interaction model
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              The dashboard keeps search hidden until the moment of intent. Desktop users can right-click empty space, while mobile can grow into a future plus-button or long-press flow without refactoring the card model.
            </p>
            <Button
              variant="ghost"
              className="mt-4 h-9 px-0 text-xs uppercase tracking-[0.18em] text-slate-400"
              onClick={closeAddCardModal}
            >
              Close
            </Button>
          </div>
        </aside>
      </div>
    </Modal>
  );
}
