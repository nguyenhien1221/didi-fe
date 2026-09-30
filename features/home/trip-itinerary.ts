import {
  GENERIC_ITINERARY_STOP_SUFFIXES_EN,
  GENERIC_ITINERARY_STOP_SUFFIXES_VI,
  PROVINCE_ITINERARY_STOPS,
} from "./constants/trip-itinerary-stops";
import type { TripItineraryDay } from "./types/trip-itinerary-day";
import type { TripSuggestion } from "./types/trip-suggestion";

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function buildGenericStops(
  provinceNameVi: string,
  provinceNameEn: string,
  days: number,
  tripId: string,
): { vi: string[]; en: string[] } {
  const hash = hashString(tripId);
  const vi: string[] = [];
  const en: string[] = [];

  for (let day = 0; day < days; day += 1) {
    if (day === 0) {
      vi.push(provinceNameVi);
      en.push(provinceNameEn);
      continue;
    }
    const suffixIndex =
      (hash + day) % GENERIC_ITINERARY_STOP_SUFFIXES_VI.length;
    vi.push(`${provinceNameVi} · ${GENERIC_ITINERARY_STOP_SUFFIXES_VI[suffixIndex]}`);
    en.push(`${provinceNameEn} · ${GENERIC_ITINERARY_STOP_SUFFIXES_EN[suffixIndex]}`);
  }

  return { vi, en };
}

/** Day-by-day stops for a trip suggestion. */
export function getTripItinerary(
  trip: TripSuggestion,
  provinceId: string,
  provinceNameVi: string,
  provinceNameEn: string,
): TripItineraryDay[] {
  const known = PROVINCE_ITINERARY_STOPS[provinceId];
  const tripVariant = trip.id.endsWith("-2") ? 1 : 0;
  const generic = buildGenericStops(
    provinceNameVi,
    provinceNameEn,
    trip.days,
    trip.id,
  );

  const viStops = known?.vi ?? generic.vi;
  const enStops = known?.en ?? generic.en;

  return Array.from({ length: trip.days }, (_, index) => {
    const stopIndex = (index + tripVariant) % viStops.length;
    return {
      day: index + 1,
      labelVi: viStops[stopIndex],
      labelEn: enStops[stopIndex],
    };
  });
}
