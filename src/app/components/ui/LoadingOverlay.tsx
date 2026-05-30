"use client";

import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export default function LoadingOverlay({
  isLoading,
  message = "Loading data...",
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/10 backdrop-blur-[1px] pointer-events-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-background/80 shadow-md border animate-in fade-in zoom-in-95 duration-150">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
        {message && (
          <p className="text-sm font-medium text-muted-foreground tracking-wide selection:bg-transparent">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
