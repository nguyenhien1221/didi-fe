import type { Locale, ProvinceFeature } from "@/features/map/types";
import { getProvinceDisplayName } from "@/features/map/map-geo";

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}

export function filterProvinces(
  features: ProvinceFeature[],
  query: string,
  locale: Locale
): ProvinceFeature[] {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];

  return features.filter((feature) => {
    const label = normalizeSearchText(getProvinceDisplayName(feature, locale));
    const alt =
      locale === "vi"
        ? normalizeSearchText(feature.properties.nameEn)
        : normalizeSearchText(feature.properties.name);
    return label.includes(normalized) || alt.includes(normalized);
  });
}
