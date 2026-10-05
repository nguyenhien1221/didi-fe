"use client";

import { useCallback, useMemo } from "react";
import type { FeatureCollection } from "geojson";
import { ZoomOut } from "lucide-react";

import { getMessages } from "@/i18n/messages";
import archipelagoList from "@/features/map/data/vietnam-archipelagos.json";
import outlineFeature from "@/features/map/data/vietnam-outline.json";
import provincesCollection from "@/features/map/data/vietnam-provinces.json";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  getCountryOutlinePath,
  getGeoPath,
  getProvinceCentroid,
  getProvinceDisplayName,
  getProvincePath,
  transformToCss,
} from "./map-geo";
import type {
  ArchipelagoCollection,
  CountryOutlineFeature,
  Locale,
  ProvinceFeature,
  VietnamProvincesCollection,
} from "./types";
import { useMapView } from "./use-map-view";

const collection = provincesCollection as VietnamProvincesCollection;
const countryOutline = outlineFeature as CountryOutlineFeature;
const archipelagos = archipelagoList as ArchipelagoCollection;

const CAPITAL = {
  provinceId: "01",
  name: "Hà Nội",
  nameEn: "Hanoi",
  coordinates: [105.8542, 21.0285] as [number, number],
};

const MAP_TRANSITION = "transform 450ms cubic-bezier(0.22, 1, 0.36, 1)";

/** Builds the points of a five-pointed star centered at the origin. */
const buildStarPoints = (outerRadius: number, innerRadius: number) =>
  Array.from({ length: 10 }, (_, index) => {
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    const angle = (Math.PI / 5) * index - Math.PI / 2;
    return `${radius * Math.cos(angle)},${radius * Math.sin(angle)}`;
  }).join(" ");

const CAPITAL_STAR_POINTS = buildStarPoints(6, 2.6);

const countryFitObject: FeatureCollection = {
  type: "FeatureCollection",
  features: [countryOutline, ...archipelagos.features],
};

interface VietnamMapProps {
  locale: Locale;
  selectedProvinceId: string | null;
  onProvinceSelect: (provinceId: string) => void;
  onResetView?: () => void;
}

export const VietnamMap = ({
  locale,
  selectedProvinceId,
  onProvinceSelect,
  onResetView,
}: VietnamMapProps) => {
  const isCountryView = selectedProvinceId === null;
  const t = getMessages(locale);
  const { size, setSize, projection, transform, resetView, featureById } =
    useMapView(collection, countryFitObject, selectedProvinceId);

  const handleZoomOut = useCallback(() => {
    resetView();
    onResetView?.();
  }, [onResetView, resetView]);

  const observeContainer = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      const update = () => {
        const rect = node.getBoundingClientRect();
        setSize({
          width: Math.floor(rect.width),
          height: Math.floor(rect.height),
        });
      };

      update();
      const observer = new ResizeObserver(update);
      observer.observe(node);
      return () => observer.disconnect();
    },
    [setSize],
  );

  const provincePaths = useMemo(() => {
    if (!projection) return [];
    return collection.features.map((feature) => {
      const province = feature as ProvinceFeature;
      return {
        id: province.properties.id,
        d: getProvincePath(province, projection),
        name: getProvinceDisplayName(province, locale),
      };
    });
  }, [locale, projection]);

  const countryOutlinePath = useMemo(() => {
    if (!projection) return "";
    return getCountryOutlinePath(countryOutline, projection);
  }, [projection]);

  const archipelagoShapes = useMemo(() => {
    if (!projection) return [];
    return archipelagos.features.flatMap((feature) => {
      const { id, name, nameEn, label } = feature.properties;
      const labelPoint = projection(label);
      if (!labelPoint) return [];
      return [
        {
          id,
          d: getGeoPath(feature, projection),
          labelX: labelPoint[0],
          labelY: labelPoint[1],
          name: locale === "en" ? nameEn : name,
        },
      ];
    });
  }, [locale, projection]);

  const handleBackgroundClick = () => {
    if (!isCountryView) {
      handleZoomOut();
    }
  };

  const handleProvinceClick = (id: string) => {
    onProvinceSelect(id);
  };

  const selectedName = selectedProvinceId
    ? getProvinceDisplayName(featureById.get(selectedProvinceId)!, locale)
    : null;

  const showCapital =
    isCountryView || selectedProvinceId === CAPITAL.provinceId;

  const capitalPoint = useMemo(() => {
    const point = projection?.(CAPITAL.coordinates);
    if (!point) return null;
    return [
      transform.translateX + transform.scale * point[0],
      transform.translateY + transform.scale * point[1],
    ] as const;
  }, [projection, transform]);

  const selectedLabelPoint = useMemo(() => {
    if (!projection || !selectedProvinceId) return null;
    const feature = featureById.get(selectedProvinceId);
    if (!feature) return null;
    const [x, y] = getProvinceCentroid(feature, projection);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    return [
      transform.translateX + transform.scale * x,
      transform.translateY + transform.scale * y,
    ] as const;
  }, [featureById, projection, selectedProvinceId, transform]);

  const selectedPath = selectedProvinceId
    ? provincePaths.find((path) => path.id === selectedProvinceId)
    : null;

  return (
    <div
      ref={observeContainer}
      className="relative h-full min-h-0 w-full flex-1 bg-background"
    >
      {size.width > 0 && projection ? (
        <svg
          role="img"
          aria-label={locale === "vi" ? "Bản đồ Việt Nam" : "Map of Vietnam"}
          width={size.width}
          height={size.height}
          className="block h-full w-full touch-none overflow-visible"
          onClick={handleBackgroundClick}
        >
          {!isCountryView ? (
            <rect
              width={size.width}
              height={size.height}
              fill="transparent"
              className="cursor-default"
            />
          ) : null}
          <g
            style={{
              transform: transformToCss(transform),
              transformOrigin: "0 0",
              transition: MAP_TRANSITION,
            }}
          >
            <g
              className={cn(
                "transition-opacity duration-500",
                !isCountryView && "opacity-40",
              )}
            >
              <path
                d={countryOutlinePath}
                className="pointer-events-none fill-[color:var(--map-province-fill)] stroke-[color:var(--map-province-stroke)] stroke-[0.6] [vector-effect:non-scaling-stroke]"
              />
              {archipelagoShapes.map((shape) => (
                <g key={shape.id} className="pointer-events-none">
                  <path
                    d={shape.d}
                    className="fill-[color:var(--map-province-fill)] stroke-[color:var(--map-province-stroke)] stroke-[0.6] [vector-effect:non-scaling-stroke]"
                  />
                  {isCountryView ? (
                    <text
                      x={shape.labelX}
                      y={shape.labelY}
                      textAnchor="middle"
                      dominantBaseline="hanging"
                      className="fill-[color:var(--map-label-color)] text-[10px] font-medium"
                    >
                      {shape.name}
                    </text>
                  ) : null}
                </g>
              ))}
            </g>
            {provincePaths.map((path) =>
              path.id === selectedProvinceId ? null : (
                <path
                  key={path.id}
                  d={path.d}
                  tabIndex={0}
                  aria-label={path.name}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleProvinceClick(path.id);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      event.stopPropagation();
                      handleProvinceClick(path.id);
                    }
                  }}
                  className="cursor-pointer fill-transparent stroke-none outline-none hover:fill-[color:var(--map-hover-fill)]"
                >
                  <title>{path.name}</title>
                </path>
              ),
            )}
            {selectedPath ? (
              <path
                d={selectedPath.d}
                tabIndex={0}
                aria-label={selectedPath.name}
                onClick={(event) => event.stopPropagation()}
                className="fill-[color:var(--map-selected-fill)] stroke-[color:var(--map-selected-stroke)] stroke-2 [vector-effect:non-scaling-stroke]"
              >
                <title>{selectedPath.name}</title>
              </path>
            ) : null}
          </g>
          {capitalPoint && showCapital ? (
            <g
              className="pointer-events-none"
              style={{
                transform: `translate(${capitalPoint[0]}px, ${capitalPoint[1]}px)`,
                transition: MAP_TRANSITION,
              }}
            >
              <polygon
                points={CAPITAL_STAR_POINTS}
                className="fill-[color:var(--map-capital-star)] stroke-white stroke-[0.8]"
              />
              {isCountryView ? (
                <text
                  x={9}
                  y={0}
                  dominantBaseline="central"
                  className="fill-[color:var(--map-capital-label)] stroke-white stroke-[3px] text-[11px] font-semibold [paint-order:stroke]"
                >
                  {locale === "en" ? CAPITAL.nameEn : CAPITAL.name}
                </text>
              ) : null}
            </g>
          ) : null}
          {selectedLabelPoint && selectedName ? (
            <g
              className="pointer-events-none"
              transform={`translate(${selectedLabelPoint[0]} ${selectedLabelPoint[1]})`}
            >
              <circle
                r={7}
                className="fill-[color:var(--map-dot-fill)] stroke-white stroke-[2.5px]"
              />
              <text
                y={-14}
                textAnchor="middle"
                className="fill-[color:var(--map-text-color)] stroke-white stroke-4 text-lg font-bold [paint-order:stroke]"
              >
                {selectedName}
              </text>
            </g>
          ) : null}
        </svg>
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          …
        </div>
      )}
      {!isCountryView ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="absolute top-3 left-3 z-10 border-border bg-background/95 shadow-sm backdrop-blur-sm"
          onClick={handleZoomOut}
        >
          <ZoomOut aria-hidden />
          {t.mapBackToCountry}
        </Button>
      ) : null}
    </div>
  );
};
