import { writeFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  area,
  bbox,
  featureCollection,
  multiPolygon,
  polygon,
  rewind,
  simplify,
  truncate,
  union,
} from "@turf/turf";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "../features/map/data");
const OUT = path.join(DATA_DIR, "vietnam-provinces.json");
const OUTLINE = path.join(DATA_DIR, "vietnam-outline.json");
const ARCHIPELAGOS = path.join(DATA_DIR, "vietnam-archipelagos.json");
const BASE =
  "https://raw.githubusercontent.com/daohoangson/dvhcvn/master/data/gis";

// Mainland + coastal islands all lie west of this longitude; Hoàng Sa and
// Trường Sa lie east of it and are rendered as boxes instead of geometry.
const ARCHIPELAGO_MIN_LON = 110.5;
const PROVINCE_TOLERANCE = 0.005;
const OUTLINE_TOLERANCE = 0.01;
const PROVINCE_MIN_AREA_M2 = 1e6;
const OUTLINE_MIN_AREA_M2 = 20e6;

// Archipelagos are drawn as a stylized inset: each island is enlarged so it is
// visible at country zoom, the cluster is compressed by `spread`, and the
// whole group is moved to `center` (closer to the mainland coast).
const ARCHIPELAGO_LAYOUT = {
  "hoang-sa": {
    name: "Hoàng Sa",
    nameEn: "Hoang Sa",
    center: [110.6, 16.6],
    spread: 0.55,
  },
  "truong-sa": {
    name: "Trường Sa",
    nameEn: "Truong Sa",
    center: [111.6, 9.9],
    spread: 0.35,
  },
};
const ISLAND_SCALE = 22;
const ISLAND_MIN_SIZE_DEG = 0.1;
const LABEL_OFFSET_DEG = 0.35;

const nameEn = JSON.parse(
  await readFile(path.join(__dirname, "province-name-en.json"), "utf8")
);

/** Returns the geometry as a list of polygon coordinate arrays. */
const toPolygons = (geometry) =>
  geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;

/** Keeps polygons whose area is at least `minArea` square meters. */
const dropSmallPolygons = (polygons, minArea) =>
  polygons.filter((coords) => area(polygon(coords)) >= minArea);

/** Simplifies polygons and rounds coordinates to keep the output small. */
const simplifyPolygons = (polygons, tolerance) =>
  truncate(
    simplify(multiPolygon(polygons), { tolerance, highQuality: true }),
    { precision: 4 }
  ).geometry.coordinates;

/** Returns the center of a [minLon, minLat, maxLon, maxLat] box. */
const boxCenter = ([x0, y0, x1, y1]) => [(x0 + x1) / 2, (y0 + y1) / 2];

/** Enlarges, compresses and moves archipelago islands into an inset. */
const layoutArchipelago = (polygons, { center: [cx, cy], spread }) => {
  const [ox, oy] = boxCenter(bbox(multiPolygon(polygons)));
  const islands = polygons.map((coords) => {
    const islandBox = bbox(polygon(coords));
    const [px, py] = boxCenter(islandBox);
    const size = Math.max(islandBox[2] - islandBox[0], islandBox[3] - islandBox[1]);
    const scale = Math.max(ISLAND_SCALE, ISLAND_MIN_SIZE_DEG / Math.max(size, 1e-6));
    const nx = cx + (px - ox) * spread;
    const ny = cy + (py - oy) * spread;
    return polygon(
      coords.map((ring) =>
        ring.map(([x, y]) => [nx + (x - px) * scale, ny + (y - py) * scale])
      )
    );
  });
  const merged =
    islands.length > 1 ? union(featureCollection(islands)) : islands[0];
  return truncate(merged, { precision: 4 }).geometry;
};

const listRes = await fetch(
  "https://api.github.com/repos/daohoangson/dvhcvn/contents/data/gis"
);
const files = (await listRes.json())
  .map((f) => f.name)
  .filter((n) => n.endsWith(".json") && n !== "level1s_bbox.json");

const features = [];
const archipelagoPolygons = { "hoang-sa": [], "truong-sa": [] };

for (const file of files) {
  const res = await fetch(`${BASE}/${file}`);
  if (!res.ok) throw new Error(`Failed ${file}`);
  const province = await res.json();
  const id = province.level1_id;

  const mainland = [];
  for (const coords of toPolygons(province)) {
    const [lon, lat] = coords[0][0];
    if (lon < ARCHIPELAGO_MIN_LON) {
      mainland.push(coords);
      continue;
    }
    archipelagoPolygons[lat > 14 ? "hoang-sa" : "truong-sa"].push(coords);
  }

  features.push({
    type: "Feature",
    id,
    properties: {
      id,
      name: province.name,
      nameEn: nameEn[id] ?? province.name,
    },
    geometry: {
      type: "MultiPolygon",
      coordinates: simplifyPolygons(
        dropSmallPolygons(mainland, PROVINCE_MIN_AREA_M2),
        PROVINCE_TOLERANCE
      ),
    },
  });
}

features.sort((a, b) => a.properties.id.localeCompare(b.properties.id));

let outline = features[0];
for (let i = 1; i < features.length; i++) {
  const merged = union(featureCollection([outline, features[i]]));
  if (merged) outline = merged;
}

// Only outer rings: holes are slivers between province borders in the source.
const outlinePolygons = simplifyPolygons(
  dropSmallPolygons(
    toPolygons(outline.geometry).map(([outer]) => [outer]),
    OUTLINE_MIN_AREA_M2
  ),
  OUTLINE_TOLERANCE
);

// d3-geo expects clockwise outer rings (opposite of RFC 7946); otherwise it
// renders the polygon's complement (the whole globe minus the shape).
const collection = rewind(
  { type: "FeatureCollection", features },
  { reverse: true }
);

const outlineFeature = rewind(
  {
    type: "Feature",
    properties: { id: "vn", name: "Việt Nam", nameEn: "Vietnam" },
    geometry: { type: "MultiPolygon", coordinates: outlinePolygons },
  },
  { reverse: true }
);

const archipelagos = rewind(
  {
    type: "FeatureCollection",
    features: Object.entries(archipelagoPolygons).map(([id, polygons]) => {
      const { name, nameEn, center, spread } = ARCHIPELAGO_LAYOUT[id];
      const geometry = layoutArchipelago(polygons, { center, spread });
      const [, minLat] = bbox(geometry);
      return {
        type: "Feature",
        properties: {
          id,
          name,
          nameEn,
          label: [center[0], Number((minLat - LABEL_OFFSET_DEG).toFixed(4))],
        },
        geometry,
      };
    }),
  },
  { reverse: true }
);

await mkdir(DATA_DIR, { recursive: true });
await writeFile(OUT, JSON.stringify(collection));
await writeFile(OUTLINE, JSON.stringify(outlineFeature));
await writeFile(ARCHIPELAGOS, JSON.stringify(archipelagos));

console.log(`Wrote ${features.length} provinces to ${OUT}`);
console.log(`Wrote national outline to ${OUTLINE}`);
console.log(
  `Wrote ${archipelagos.features.length} archipelagos to ${ARCHIPELAGOS}`
);
