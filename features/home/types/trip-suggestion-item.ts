import type { Locale } from "@/features/map/types";

import type { TripSuggestion } from "./trip-suggestion";

export interface TripSuggestionItemProps {
  locale: Locale;
  trip: TripSuggestion;
  className?: string;
  isSelected?: boolean;
  onSelect?: (tripId: string) => void;
}
