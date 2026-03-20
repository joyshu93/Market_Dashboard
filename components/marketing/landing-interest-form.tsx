"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { cn } from "@/lib/utils/cn";

const interestOptions = [
  {
    id: "brief",
    label: "Morning brief",
    description: "I want a cleaner market briefing to open every day.",
  },
  {
    id: "cards",
    label: "Custom cards",
    description: "I want to arrange my own market home screen.",
  },
  {
    id: "premium",
    label: "Premium mode",
    description: "I would pay for deeper briefs or an ad-free workflow.",
  },
] as const;

type InterestOptionId = (typeof interestOptions)[number]["id"];

export function LandingInterestForm() {
  const [email, setEmail] = useState("");
  const [selectedInterest, setSelectedInterest] = useState<InterestOptionId>("brief");
  const [status, setStatus] = useState<"idle" | "saved">("idle");
  const [savedCount, setSavedCount] = useState(0);

  const selectedOption = useMemo(
    () => interestOptions.find((option) => option.id === selectedInterest),
    [selectedInterest],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const storageKey = "market-home-waitlist-v1";
      const entries = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");

      if (Array.isArray(entries)) {
        setSavedCount(entries.length);
      }
    } catch {
      setSavedCount(0);
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      return;
    }

    const storageKey = "market-home-waitlist-v1";
    const previousEntries =
      typeof window !== "undefined"
        ? JSON.parse(window.localStorage.getItem(storageKey) ?? "[]")
        : [];

    const nextEntries = [
      ...previousEntries,
      {
        email: normalizedEmail,
        interest: selectedInterest,
        createdAt: new Date().toISOString(),
      },
    ];

    window.localStorage.setItem(storageKey, JSON.stringify(nextEntries));
    setStatus("saved");
    setSavedCount(nextEntries.length);
    setEmail("");
  };

  return (
    <div className="card-surface-strong rounded-[32px] p-5 sm:p-6">
      <div className="space-y-3">
        <Pill label="Validation mode" tone="default" />
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-white">
            Join the early waitlist
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            This page is for early demand testing. Pick the value that interests you
            most and leave an email to get the next preview.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {interestOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setSelectedInterest(option.id)}
            className={cn(
              "rounded-[22px] border px-4 py-4 text-left transition",
              selectedInterest === option.id
                ? "border-white/30 bg-white/[0.08] shadow-[0_16px_32px_rgba(111,169,255,0.12)]"
                : "border-white/8 bg-white/[0.03] hover:bg-white/[0.05]",
            )}
          >
            <p className="text-sm font-medium text-white">{option.label}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{option.description}</p>
          </button>
        ))}
      </div>

      <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="waitlist-email">
          Email
        </label>
        <input
          id="waitlist-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@email.com"
          className="h-12 flex-1 rounded-full border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-white/25"
        />
        <Button type="submit" variant="primary" className="h-12 px-6">
          Join waitlist
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Selected interest: {selectedOption?.label ?? "Morning brief"}
          </p>
          <p className="text-sm text-slate-400">
            Premium fake door: this form tests whether users want better briefs,
            custom cards, or an ad-free workflow.
          </p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Local test signups
          </p>
          <p className="text-sm text-slate-300">{savedCount} saved on this device</p>
          {status === "saved" ? (
            <p className="text-sm text-emerald-300">Saved. Replace local storage with a real form backend when ready.</p>
          ) : (
            <p className="text-sm text-slate-400">Current prototype stores entries locally for fast validation.</p>
          )}
        </div>
      </div>
    </div>
  );
}
