declare module "@/features/map/data/vietnam-provinces.json" {
  import type { VietnamProvincesCollection } from "@/features/map/types";

  const value: VietnamProvincesCollection;
  export default value;
}

declare module "@/features/map/data/vietnam-archipelagos.json" {
  import type { ArchipelagoCollection } from "@/features/map/types";

  const value: ArchipelagoCollection;
  export default value;
}

declare module "@/features/map/data/vietnam-outline.json" {
  import type { CountryOutlineFeature } from "@/features/map/types";

  const value: CountryOutlineFeature;
  export default value;
}
