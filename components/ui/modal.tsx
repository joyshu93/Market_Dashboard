"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/72 px-4 py-8 backdrop-blur-md"
      onClick={onClose}
      data-no-dashboard-context
    >
      <div
        className={cn(
          "card-surface-strong w-full max-w-3xl overflow-hidden border-white/10",
          className,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-white/10 px-6 py-5 sm:px-7">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            {description ? (
              <p className="max-w-2xl text-sm leading-6 text-slate-400">{description}</p>
            ) : null}
          </div>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Close modal"
            onClick={onClose}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-6 py-5 sm:px-7 sm:py-6">{children}</div>
      </div>
    </div>
  );
}
