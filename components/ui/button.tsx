"use client";

import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-white text-slate-950 shadow-[0_16px_30px_rgba(255,255,255,0.12)] hover:bg-slate-100",
  secondary:
    "border border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.12]",
  ghost: "bg-transparent text-slate-300 hover:bg-white/[0.07] hover:text-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 rounded-full px-3.5 text-xs font-medium",
  md: "h-11 rounded-full px-5 text-sm font-medium",
  icon: "h-10 w-10 rounded-full text-sm",
};

export function Button({
  className,
  variant = "secondary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
