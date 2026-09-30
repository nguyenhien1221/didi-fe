"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createProjection,
  getProvinceBounds,
  getZoomTransform,
  identityTransform,
} from "./map-geo";
import type { FeatureCollection } from "geojson";

import type {
  MapTransform,
  ProvinceFeature,
  VietnamProvincesCollection,
} from "./types";

export function useMapView(
  collection: VietnamProvincesCollection,
  fitObject: FeatureCollection,
  selectedProvinceId: string | null
) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [transform, setTransform] = useState<MapTransform>(identityTransform);

  const projection = useMemo(() => {
    if (size.width <= 0 || size.height <= 0) return null;
    return createProjection(fitObject, size.width, size.height);
  }, [fitObject, size.height, size.width]);

  const featureById = useMemo(() => {
    const map = new Map<string, ProvinceFeature>();
    for (const feature of collection.features) {
      map.set(feature.properties.id, feature as ProvinceFeature);
    }
    return map;
  }, [collection]);

  const zoomToProvince = useCallback(
    (provinceId: string | null) => {
      if (!projection || size.width <= 0 || size.height <= 0) {
        setTransform(identityTransform);
        return;
      }
      if (!provinceId) {
        setTransform(identityTransform);
        return;
      }
      const feature = featureById.get(provinceId);
      if (!feature) {
        setTransform(identityTransform);
        return;
      }
      const bounds = getProvinceBounds(feature, projection);
      setTransform(getZoomTransform(bounds, size.width, size.height));
    },
    [featureById, projection, size.height, size.width]
  );

  useEffect(() => {
    zoomToProvince(selectedProvinceId);
  }, [selectedProvinceId, zoomToProvince]);

  const resetView = useCallback(() => {
    setTransform(identityTransform);
  }, []);

  return {
    size,
    setSize,
    projection,
    transform,
    resetView,
    zoomToProvince,
    featureById,
  };
}
