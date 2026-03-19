import type { Instrument, MarketTrend, MetricTone, ValueStyle } from "@/types/dashboard";

const numberFormatterCache = new Map<string, Intl.NumberFormat>();

function getNumberFormatter(
  valueStyle: ValueStyle,
  currency: string,
  precision: number,
) {
  const formatterKey = `${valueStyle}-${currency}-${precision}`;

  if (!numberFormatterCache.has(formatterKey)) {
    numberFormatterCache.set(
      formatterKey,
      new Intl.NumberFormat("en-US", {
        style: valueStyle === "currency" ? "currency" : "decimal",
        currency,
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }),
    );
  }

  return numberFormatterCache.get(formatterKey)!;
}

export function getInstrumentPrecision(instrument: Instrument) {
  return typeof instrument.metadata?.precision === "number"
    ? instrument.metadata.precision
    : instrument.category === "rate"
      ? 3
      : instrument.category === "crypto"
        ? 0
        : 2;
}

export function getInstrumentValueStyle(instrument: Instrument): ValueStyle {
  return instrument.metadata?.valueStyle ?? "number";
}

export function formatInstrumentValue(value: number, instrument: Instrument) {
  const precision = getInstrumentPrecision(instrument);
  const valueStyle = getInstrumentValueStyle(instrument);

  if (valueStyle === "percent") {
    return `${value.toFixed(precision)}%`;
  }

  if (valueStyle === "currency") {
    return getNumberFormatter("currency", instrument.currency, precision).format(value);
  }

  return getNumberFormatter("number", instrument.currency, precision).format(value);
}

export function formatSignedValue(value: number, instrument: Instrument) {
  const absoluteValue = Math.abs(value);
  const prefix = value > 0 ? "+" : value < 0 ? "-" : "";

  if (getInstrumentValueStyle(instrument) === "percent") {
    return `${prefix}${absoluteValue.toFixed(getInstrumentPrecision(instrument))}%`;
  }

  if (getInstrumentValueStyle(instrument) === "currency") {
    return `${prefix}${formatInstrumentValue(absoluteValue, instrument)}`;
  }

  return `${prefix}${absoluteValue.toLocaleString("en-US", {
    minimumFractionDigits: getInstrumentPrecision(instrument),
    maximumFractionDigits: getInstrumentPrecision(instrument),
  })}`;
}

export function formatSignedPercent(value: number) {
  const prefix = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${prefix}${Math.abs(value).toFixed(2)}%`;
}

export function getTrend(change: number): MarketTrend {
  if (change > 0) {
    return "up";
  }

  if (change < 0) {
    return "down";
  }

  return "flat";
}

export function getToneClassName(tone: MetricTone | MarketTrend) {
  if (tone === "positive" || tone === "up") {
    return "metric-rise";
  }

  if (tone === "negative" || tone === "down") {
    return "metric-fall";
  }

  return "metric-flat";
}

export function formatUpdatedAt(isoString: string) {
  return new Date(isoString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeUpdatedAt(isoString: string) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMinutes = Math.max(0, Math.round(diffMs / 60_000));

  if (diffMinutes < 1) {
    return "Updated just now";
  }

  if (diffMinutes < 60) {
    return `Updated ${diffMinutes}m ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  return `Updated ${diffHours}h ago`;
}
