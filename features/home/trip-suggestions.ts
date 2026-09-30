import type { Locale } from "@/features/map/types";
import {
  TRIP_SUGGESTION_DURATION_OPTIONS,
  TRIP_SUGGESTION_PRICE_BASE_A,
  TRIP_SUGGESTION_PRICE_DECIMALS,
  TRIP_SUGGESTION_PRICE_MOD_A,
} from "./constants/trip-suggestions";
import type { TripSuggestion } from "./types";

export type { TripSuggestion } from "./types";

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Seed trip ideas per province until API data exists. */
export function getTripSuggestionsForProvince(
  provinceId: string,
  provinceNameVi: string,
  provinceNameEn: string,
): TripSuggestion[] {
  const hash = hashString(provinceId);
  const titleVariantsVi = [
    provinceNameVi,
    `${provinceNameVi} · Khám phá`,
    `${provinceNameVi} · Trải nghiệm`,
    `${provinceNameVi} · Nghỉ dưỡng`,
  ];
  const titleVariantsEn = [
    provinceNameEn,
    `${provinceNameEn} · Explorer`,
    `${provinceNameEn} · Experience`,
    `${provinceNameEn} · Retreat`,
  ];

  return TRIP_SUGGESTION_DURATION_OPTIONS.map(([days, nights], index) => {
    const priceOffset =
      ((hash >> (index * 2)) % TRIP_SUGGESTION_PRICE_MOD_A) /
      TRIP_SUGGESTION_PRICE_DECIMALS;
    const priceMillion =
      Math.round(
        (TRIP_SUGGESTION_PRICE_BASE_A + priceOffset + index * 0.15) * 10,
      ) / 10;

    return {
      id: `${provinceId}-${index + 1}`,
      titleVi: titleVariantsVi[index] ?? provinceNameVi,
      titleEn: titleVariantsEn[index] ?? provinceNameEn,
      days,
      nights,
      priceMillion,
    };
  });
}

export function formatTripDuration(
  days: number,
  nights: number,
  locale: Locale,
): string {
  if (locale === "vi") {
    return `${days}N${nights}Đ`;
  }
  return `${days}D · ${nights}N`;
}

export function formatTripPrice(priceMillion: number, locale: Locale): string {
  const formatted =
    priceMillion % 1 === 0 ? String(priceMillion) : priceMillion.toFixed(1);
  if (locale === "vi") {
    return `${formatted}tr`;
  }
  return `$${formatted}M`;
}

export function getTripTitle(trip: TripSuggestion, locale: Locale): string {
  return locale === "vi" ? trip.titleVi : trip.titleEn;
}

export function getTripHref(tripId: string): string {
  return `/trips/${encodeURIComponent(tripId)}`;
}

export function parseTripSuggestionProvinceId(tripId: string): string | null {
  const match = tripId.match(/^(.+)-(\d+)$/);
  return match?.[1] ?? null;
}

export function findTripSuggestionById(
  tripId: string,
  provinceId: string,
  provinceNameVi: string,
  provinceNameEn: string,
): TripSuggestion | null {
  const trips = getTripSuggestionsForProvince(
    provinceId,
    provinceNameVi,
    provinceNameEn,
  );
  return trips.find((trip) => trip.id === tripId) ?? null;
}
