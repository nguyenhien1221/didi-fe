"use client";

import { useCallback, useMemo, useState } from "react";

import { LocaleProvider, useLocale } from "@/i18n/locale-context";
import { VietnamMap } from "@/features/map/vietnam-map";
import provincesCollection from "@/features/map/data/vietnam-provinces.json";
import type {
  ProvinceFeature,
  VietnamProvincesCollection,
} from "@/features/map/types";

import { HomeHeader } from "./home-header";
import { HomeSearchBar } from "./home-search-bar";
import { ProvinceInfoCard } from "./province-info-card";
import { TripDetailCard } from "./trip-detail-card";
import { getTripItinerary } from "./trip-itinerary";
import { findTripSuggestionById } from "./trip-suggestions";

const collection = provincesCollection as VietnamProvincesCollection;

const HomePageContent = () => {
  const { locale, t } = useLocale();
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(
    null,
  );
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  const handleProvinceSelect = useCallback((provinceId: string | null) => {
    setSelectedProvinceId(provinceId);
    setSelectedTripId(null);
  }, []);

  const provinces = useMemo(() => collection.features as ProvinceFeature[], []);

  const selectedProvince = useMemo(() => {
    if (!selectedProvinceId) return null;
    return (
      provinces.find((p) => p.properties.id === selectedProvinceId) ?? null
    );
  }, [provinces, selectedProvinceId]);

  const selectedTrip = useMemo(() => {
    if (!selectedTripId || !selectedProvince) return null;
    return findTripSuggestionById(
      selectedTripId,
      selectedProvince.properties.id,
      selectedProvince.properties.name,
      selectedProvince.properties.nameEn,
    );
  }, [selectedTripId, selectedProvince]);

  const selectedTripItinerary = useMemo(() => {
    if (!selectedTrip || !selectedProvince) return [];
    return getTripItinerary(
      selectedTrip,
      selectedProvince.properties.id,
      selectedProvince.properties.name,
      selectedProvince.properties.nameEn,
    );
  }, [selectedTrip, selectedProvince]);

  const hasSidePanel = Boolean(selectedProvince);
  const hasTripPanel = Boolean(selectedTrip);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <HomeHeader />
      <div className="w-full max-w-md shrink-0">
        <HomeSearchBar
          locale={locale}
          provinces={provinces}
          placeholder={t.searchPlaceholder}
          noResultsLabel={t.searchNoResults}
          onSelectProvince={handleProvinceSelect}
        />
      </div>

      <div
        className={`flex min-h-0 flex-1 overflow-hidden ${hasSidePanel ? "flex-col md:flex-row" : "flex-col"}`}
      >
        <div className="relative z-0 min-h-0 min-w-0 flex-1 overflow-hidden">
          <VietnamMap
            locale={locale}
            selectedProvinceId={selectedProvinceId}
            onProvinceSelect={handleProvinceSelect}
            onResetView={() => handleProvinceSelect(null)}
          />
        </div>
        {hasTripPanel && selectedTrip ? (
          <aside className="relative z-10 h-[min(20rem,42vh)] w-full shrink-0 overflow-hidden bg-background p-3 md:h-full md:w-80 md:p-4 lg:w-96">
            <TripDetailCard
              key={selectedTrip.id}
              locale={locale}
              trip={selectedTrip}
              itinerary={selectedTripItinerary}
              onClose={() => setSelectedTripId(null)}
            />
          </aside>
        ) : null}
        {selectedProvince ? (
          <aside className="relative z-10 h-[min(22rem,48vh)] w-full shrink-0 overflow-hidden bg-background p-3 md:h-full md:w-96 md:p-4 lg:w-[28rem]">
            <ProvinceInfoCard
              key={selectedProvince.properties.id}
              locale={locale}
              province={selectedProvince}
              selectedTripId={selectedTrip?.id ?? null}
              onTripSelect={(tripId) =>
                setSelectedTripId((prev) => (prev === tripId ? null : tripId))
              }
            />
          </aside>
        ) : null}
      </div>
    </div>
  );
};

export const HomePage = () => (
  <LocaleProvider>
    <HomePageContent />
  </LocaleProvider>
);
