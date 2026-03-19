import type { MarketTrend } from "@/types/dashboard";

import { cn } from "@/lib/utils/cn";

interface TrendChartProps {
  points: number[];
  trend: MarketTrend;
  variant?: "sparkline" | "detail";
  className?: string;
}

const chartTone = {
  up: {
    stroke: "rgba(80, 224, 170, 1)",
    fill: "rgba(80, 224, 170, 0.18)",
  },
  down: {
    stroke: "rgba(255, 110, 128, 1)",
    fill: "rgba(255, 110, 128, 0.16)",
  },
  flat: {
    stroke: "rgba(154, 164, 179, 1)",
    fill: "rgba(154, 164, 179, 0.14)",
  },
};

export function TrendChart({
  points,
  trend,
  variant = "sparkline",
  className,
}: TrendChartProps) {
  const width = 100;
  const height = variant === "detail" ? 52 : 24;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const padding = variant === "detail" ? 4 : 2;

  const mappedPoints = points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * width;
      const y =
        height -
        padding -
        ((point - min) / range) * (height - padding * 2);

      return `${x},${y}`;
    })
    .join(" ");

  const firstPoint = mappedPoints.split(" ")[0]?.split(",")[0] ?? "0";
  const lastPoint = mappedPoints.split(" ").at(-1)?.split(",")[0] ?? "100";
  const fillPoints = `${firstPoint},${height} ${mappedPoints} ${lastPoint},${height}`;
  const colors = chartTone[trend];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      {variant === "detail" ? (
        <>
          <line
            x1="0"
            x2={width}
            y1={height * 0.25}
            y2={height * 0.25}
            stroke="rgba(255,255,255,0.05)"
            strokeDasharray="2 4"
          />
          <line
            x1="0"
            x2={width}
            y1={height * 0.7}
            y2={height * 0.7}
            stroke="rgba(255,255,255,0.05)"
            strokeDasharray="2 4"
          />
        </>
      ) : null}

      <polygon points={fillPoints} fill={colors.fill} />
      <polyline
        fill="none"
        stroke={colors.stroke}
        strokeWidth={variant === "detail" ? 2.2 : 2}
        strokeLinejoin="round"
        strokeLinecap="round"
        points={mappedPoints}
      />
    </svg>
  );
}
