import type { Locale, ProvinceFeature } from "@/features/map/types";

export type ProvinceTab = "info" | "images" | "travel";

export interface ProvinceInfoCardProps {
  locale: Locale;
  province: ProvinceFeature;
  selectedTripId?: string | null;
  onTripSelect?: (tripId: string) => void;
}

export interface ProvinceTabItem {
  id: ProvinceTab;
  label: string;
}
