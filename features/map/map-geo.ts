import { geoMercator, geoPath } from "d3-geo";
import type { GeoProjection } from "d3-geo";

import type {
  CountryOutlineFeature,
  MapTransform,
  ProvinceFeature,
} from "./types";
import type { Feature, FeatureCollection, GeometryObject } from "geojson";

const MAP_PADDING = 8;
const ZOOM_PADDING = 12;

export function createProjection(
  fitObject: GeometryObject | Feature | FeatureCollection,
  width: number,
  height: number
): GeoProjection {
  return geoMercator().fitExtent(
    [
      [MAP_PADDING, MAP_PADDING],
      [width - MAP_PADDING, height - MAP_PADDING],
    ],
    fitObject
  );
}

export function getGeoPath(
  feature: Feature,
  projection: GeoProjection
): string {
  return geoPath(projection)(feature) ?? "";
}

export function getProvincePath(
  feature: ProvinceFeature,
  projection: GeoProjection
): string {
  return getGeoPath(feature, projection);
}

export function getCountryOutlinePath(
  feature: CountryOutlineFeature,
  projection: GeoProjection
): string {
  return getGeoPath(feature, projection);
}

export function getProvinceBounds(
  feature: ProvinceFeature,
  projection: GeoProjection
): [[number, number], [number, number]] {
  const bounds = geoPath(projection).bounds(feature);
  return bounds;
}

export function getProvinceCentroid(
  feature: ProvinceFeature,
  projection: GeoProjection
): [number, number] {
  return geoPath(projection).centroid(feature);
}

export function getZoomTransform(
  bounds: [[number, number], [number, number]],
  width: number,
  height: number,
  padding = ZOOM_PADDING
): MapTransform {
  const [[x0, y0], [x1, y1]] = bounds;
  const boxWidth = x1 - x0;
  const boxHeight = y1 - y0;
  if (boxWidth <= 0 || boxHeight <= 0) {
    return { scale: 1, translateX: 0, translateY: 0 };
  }

  const scale = Math.min(
    (width - padding * 2) / boxWidth,
    (height - padding * 2) / boxHeight
  );
  const centerX = (x0 + x1) / 2;
  const centerY = (y0 + y1) / 2;
  const translateX = width / 2 - scale * centerX;
  const translateY = height / 2 - scale * centerY;

  return { scale, translateX, translateY };
}

export const identityTransform: MapTransform = {
  scale: 1,
  translateX: 0,
  translateY: 0,
};

export function transformToCss(transform: MapTransform): string {
  return `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scale})`;
}

export function getProvinceDisplayName(
  feature: ProvinceFeature,
  locale: "vi" | "en"
): string {
  return locale === "en" ? feature.properties.nameEn : feature.properties.name;
}
