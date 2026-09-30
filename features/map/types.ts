import type { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";

export type ProvinceGeometry = Polygon | MultiPolygon;

export interface ProvinceProperties {
  id: string;
  name: string;
  nameEn: string;
}

export type ProvinceFeature = Feature<ProvinceGeometry, ProvinceProperties>;

export type VietnamProvincesCollection = FeatureCollection<
  ProvinceGeometry,
  ProvinceProperties
>;

export interface CountryOutlineProperties {
  id: string;
  name: string;
  nameEn: string;
}

export type CountryOutlineFeature = Feature<
  ProvinceGeometry,
  CountryOutlineProperties
>;

export interface ArchipelagoProperties {
  id: string;
  name: string;
  nameEn: string;
  label: [number, number];
}

export type ArchipelagoCollection = FeatureCollection<
  ProvinceGeometry,
  ArchipelagoProperties
>;

export type Locale = "vi" | "en";

export interface MapTransform {
  scale: number;
  translateX: number;
  translateY: number;
}
