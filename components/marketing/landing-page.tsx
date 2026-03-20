import Link from "next/link";
import { ArrowRight, LayoutGrid, Newspaper, Sparkles, Star, Waves } from "lucide-react";

import { TrendChart } from "@/components/charts/trend-chart";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { LandingInterestForm } from "@/components/marketing/landing-interest-form";
import { instruments, marketSnapshots } from "@/lib/mock/market-data";
import {
  formatInstrumentValue,
  formatSignedPercent,
  formatSignedValue,
  getTrend,
} from "@/lib/utils/format";

const previewIds = ["kospi", "usd-krw", "btc"] as const;

const valueRows = [
  {
    title: "Read the market in 30 seconds",
    body: "See Korea, US, FX, rates, commodities, and crypto in one calm screen instead of five different tabs.",
    icon: Sparkles,
  },
  {
    title: "Build your own market home",
    body: "Keep the instruments you actually watch and let card size control how much context you want.",
    icon: LayoutGrid,
  },
  {
    title: "Open for the brief, not only the price",
    body: "This product is strongest when it tells you what matters now, not only the latest number.",
    icon: Newspaper,
  },
] as const;

const validationRows = [
  "Problem interviews with Korea-based retail investors",
  "Landing-page waitlist test for positioning validation",
  "Premium fake-door test before building paid features",
];

function PreviewCard({
  instrumentId,
  mode,
}: {
  instrumentId: (typeof previewIds)[number];
  mode: "small" | "wide" | "large";
}) {
  const instrument = instruments.find((item) => item.id === instrumentId)!;
  const snapshot = marketSnapshots[instrumentId];
  const trend = getTrend(snapshot.change);

  return (
    <div
      className={[
        "card-surface relative overflow-hidden border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.94),rgba(11,17,28,0.92))] p-4",
        mode === "small" ? "aspect-square" : "",
        mode === "wide" ? "min-h-[188px]" : "",
        mode === "large" ? "min-h-[300px]" : "",
      ].join(" ")}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(111,169,255,0.14),transparent_42%)]" />
      <div className="relative flex h-full min-h-0 flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Pill label={instrument.category} tone="neutral" />
            <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              {instrument.market}
            </span>
          </div>
          <div>
            <p className="text-base font-medium text-white">{instrument.symbol}</p>
            <p className="mt-1 text-sm text-slate-400">{instrument.name}</p>
          </div>
        </div>

        <div className="space-y-3">
          <p
            className={
              mode === "small"
                ? "text-2xl font-semibold tracking-tight text-white"
                : "text-3xl font-semibold tracking-tight text-white"
            }
          >
            {formatInstrumentValue(snapshot.price, instrument)}
          </p>
          <div
            className={`flex flex-wrap items-center gap-2 text-sm ${
              trend === "up"
                ? "metric-rise"
                : trend === "down"
                  ? "metric-fall"
                  : "metric-flat"
            }`}
          >
            <span>{formatSignedValue(snapshot.change, instrument)}</span>
            <span>{formatSignedPercent(snapshot.changePct)}</span>
          </div>

          {mode !== "small" ? (
            <div className={mode === "large" ? "space-y-3" : "space-y-2"}>
              <div className={mode === "large" ? "h-28" : "h-16"}>
                <TrendChart
                  points={mode === "large" ? snapshot.detailSeries : snapshot.sparkline}
                  trend={trend}
                  variant={mode === "large" ? "detail" : "sparkline"}
                />
              </div>
              <p className="text-sm leading-6 text-slate-400">
                {mode === "large" ? snapshot.summary : snapshot.statusText}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
          <Waves className="h-4 w-4 text-slate-300" />
          <span className="text-xs uppercase tracking-[0.28em] text-slate-300">
            Market Home
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/dashboard">
            <Button variant="secondary">Open product preview</Button>
          </Link>
          <a href="#waitlist">
            <Button variant="primary">
              Join waitlist
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(520px,0.95fr)] lg:items-center">
        <div className="space-y-6">
          <Pill label="Korea-focused market brief home" tone="default" />
          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Open one screen and understand today&apos;s market mood.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              A market home screen for people who check Korea, US, FX, rates,
              commodities, and crypto every day. Less terminal noise, more
              clarity on what matters now.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a href="#waitlist">
              <Button variant="primary">
                Validate this idea with me
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <Link href="/dashboard">
              <Button variant="secondary">See the dashboard preview</Button>
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Positioning
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Market brief home, not a trading terminal
              </p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Core habit
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                30-second morning and close check-in
              </p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Business test
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Waitlist, fake door, and premium interest first
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:row-span-2">
            <PreviewCard instrumentId="kospi" mode="large" />
          </div>
          <PreviewCard instrumentId="usd-krw" mode="wide" />
          <PreviewCard instrumentId="btc" mode="small" />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {valueRows.map((row) => {
          const Icon = row.icon;

          return (
            <article
              key={row.title}
              className="card-surface rounded-[28px] p-5 sm:p-6"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                <Icon className="h-5 w-5 text-slate-200" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-white">
                {row.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">{row.body}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="card-surface rounded-[28px] p-5 sm:p-6">
          <Pill label="Validation path" tone="default" />
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white">
            We are validating workflow value before deeper infrastructure.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
            The next step is not building a bigger terminal. It is proving that
            a cleaner market home screen deserves daily attention and can later
            support premium value.
          </p>
          <div className="mt-6 space-y-3">
            {validationRows.map((row) => (
              <div
                key={row}
                className="flex items-start gap-3 rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4"
              >
                <Star className="mt-0.5 h-4 w-4 text-slate-300" />
                <p className="text-sm leading-6 text-slate-300">{row}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="waitlist">
          <LandingInterestForm />
        </div>
      </section>
    </main>
  );
}
