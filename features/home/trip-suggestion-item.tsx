import { Camera } from "lucide-react";

import { cn } from "@/lib/utils";

import type { TripSuggestionItemProps } from "./types";
import {
  formatTripDuration,
  formatTripPrice,
  getTripTitle,
} from "./trip-suggestions";

export const TripSuggestionItem = ({
  locale,
  trip,
  className,
  isSelected = false,
  onSelect,
}: TripSuggestionItemProps) => {
  const title = getTripTitle(trip, locale);
  const meta = `${formatTripDuration(trip.days, trip.nights, locale)} • ${formatTripPrice(trip.priceMillion, locale)}`;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(trip.id)}
      aria-pressed={isSelected}
      className={cn(
        "relative block w-full px-3 py-2.5 text-left font-mono text-sm leading-snug text-foreground cursor-pointer",
        "rounded-sm transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isSelected && "bg-muted/70 ring-1 ring-border/80",
        className,
      )}
    >
      <span className="pointer-events-none absolute inset-0" aria-hidden>
        <span className="absolute top-0 left-0 size-2.5 border-t-2 border-l-2 border-foreground/90" />
        <span className="absolute top-0 right-0 size-2.5 border-t-2 border-r-2 border-foreground/90" />
        <span className="absolute bottom-0 left-0 size-2.5 border-b-2 border-l-2 border-foreground/90" />
        <span className="absolute right-0 bottom-0 size-2.5 border-r-2 border-b-2 border-foreground/90" />
        <span className="absolute top-0 right-3 left-3 border-t border-dashed border-foreground/35" />
        <span className="absolute right-0 bottom-0 left-3 border-b border-dashed border-foreground/35" />
        <span className="absolute top-3 bottom-3 left-0 border-l border-dashed border-foreground/35" />
        <span className="absolute top-3 right-0 bottom-3 border-r border-dashed border-foreground/35" />
      </span>
      <div className="relative flex items-start gap-2">
        <Camera
          className="mt-0.5 size-3.5 shrink-0 text-foreground/85"
          strokeWidth={1.75}
          aria-hidden
        />
        <div className="min-w-0 space-y-0.5">
          <p className="truncate font-medium">{title}</p>
          <p className="text-muted-foreground">{meta}</p>
        </div>
      </div>
    </button>
  );
};
