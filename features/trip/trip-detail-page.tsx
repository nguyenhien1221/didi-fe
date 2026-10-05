"use client";

import Link from "next/link";
import { useMemo } from "react";

import { buttonVariants } from "@/components/ui/button";
import { LocaleProvider, useLocale } from "@/i18n/locale-context";
import {
  findTripSuggestionById,
  formatTripDuration,
  formatTripPrice,
  getTripTitle,
  parseTripSuggestionProvinceId,
} from "@/features/home/trip-suggestions";
import provincesCollection from "@/features/map/data/vietnam-provinces.json";
import type {
  ProvinceFeature,
  VietnamProvincesCollection,
} from "@/features/map/types";
import { cn } from "@/lib/utils";

const collection = provincesCollection as VietnamProvincesCollection;

interface TripDetailPageProps {
  tripId: string;
}

const TripDetailContent = ({ tripId }: TripDetailPageProps) => {
  const { locale, t } = useLocale();

  const trip = useMemo(() => {
    const provinceId = parseTripSuggestionProvinceId(tripId);
    if (!provinceId) return null;

    const province = collection.features.find(
      (feature) => feature.properties.id === provinceId,
    ) as ProvinceFeature | undefined;
    if (!province) return null;

    return findTripSuggestionById(
      tripId,
      provinceId,
      province.properties.name,
      province.properties.nameEn,
    );
  }, [tripId]);

  if (!trip) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-4 px-6">
        <p className="text-muted-foreground">{t.searchNoResults}</p>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "default" }), "w-fit")}
        >
          {t.tripBackHome}
        </Link>
      </div>
    );
  }

  const title = getTripTitle(trip, locale);
  const meta = `${formatTripDuration(trip.days, trip.nights, locale)} • ${formatTripPrice(trip.priceMillion, locale)}`;

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col gap-6 px-6 py-10">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "w-fit",
        )}
      >
        {t.tripBackHome}
      </Link>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="font-mono text-sm text-muted-foreground">{meta}</p>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {t.tripDetailPlaceholder}
      </p>
    </div>
  );
};

export const TripDetailPage = ({ tripId }: TripDetailPageProps) => (
  <LocaleProvider>
    <TripDetailContent tripId={tripId} />
  </LocaleProvider>
);
