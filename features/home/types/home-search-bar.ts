import type { Locale, ProvinceFeature } from "@/features/map/types";

export interface HomeSearchBarProps {
  locale: Locale;
  provinces: ProvinceFeature[];
  onSelectProvince: (provinceId: string) => void;
  placeholder: string;
  noResultsLabel: string;
}
