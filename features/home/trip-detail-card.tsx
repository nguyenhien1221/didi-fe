"use client";

import { X } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMessages } from "@/features/i18n/messages";
import type { Locale } from "@/features/map/types";

import { provinceCardEntranceTransition } from "./constants";
import type { TripItineraryDay } from "./types/trip-itinerary-day";
import type { TripSuggestion } from "./types/trip-suggestion";
import {
  formatTripDuration,
  formatTripPrice,
  getTripTitle,
} from "./trip-suggestions";

export interface TripDetailCardProps {
  locale: Locale;
  trip: TripSuggestion;
  itinerary: TripItineraryDay[];
  onClose: () => void;
}

export const TripDetailCard = ({
  locale,
  trip,
  itinerary,
  onClose,
}: TripDetailCardProps) => {
  const t = getMessages(locale);
  const title = getTripTitle(trip, locale);
  const meta = `${formatTripDuration(trip.days, trip.nights, locale)} • ${formatTripPrice(trip.priceMillion, locale)}`;
  const dayLabel = locale === "vi" ? "Ngày" : "Day";

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={provinceCardEntranceTransition}
    >
      <Card className="flex h-full min-h-0 flex-col gap-0 overflow-hidden bg-card py-0 ring-border/60">
        <CardHeader className="shrink-0 gap-1 border-b border-border/60 pb-3">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1 space-y-1">
              <CardTitle className="text-base leading-snug">{title}</CardTitle>
              <p className="font-mono text-xs text-muted-foreground">{meta}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0"
              onClick={onClose}
              aria-label={t.tripDetailClose}
            >
              <X className="size-4" aria-hidden />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 overflow-y-auto pb-4">
          <p className="pt-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {t.tripItineraryLabel}
          </p>
          <ol className="mt-3 space-y-2">
            {itinerary.map((stop) => (
              <li
                key={stop.day}
                className="rounded-md border border-border/60 bg-muted/30 px-3 py-2 font-mono text-sm"
              >
                <span className="text-muted-foreground">
                  {dayLabel} {stop.day}:
                </span>{" "}
                <span className="font-medium text-foreground">
                  {locale === "vi" ? stop.labelVi : stop.labelEn}
                </span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </motion.div>
  );
};
