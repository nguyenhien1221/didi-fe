"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { getProvinceDisplayName } from "@/features/map/map-geo";
import { cn } from "@/lib/utils";

import { filterProvinces } from "./search-utils";
import type { HomeSearchBarProps } from "./types";

export const HomeSearchBar = ({
  locale,
  provinces,
  onSelectProvince,
  placeholder,
  noResultsLabel,
}: HomeSearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(
    () => filterProvinces(provinces, query, locale).slice(0, 8),
    [locale, provinces, query],
  );

  const showDropdown = isOpen && query.trim().length > 0;

  const handleSelect = (id: string) => {
    onSelectProvince(id);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative  bg-background px-4 py-3 sm:px-6">
      <label className="relative block">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          placeholder={placeholder}
          className={cn(
            "h-11 w-full rounded-xl border border-input bg-input/30 pr-4 pl-10 text-sm outline-none",
            "placeholder:text-muted-foreground",
          )}
          autoComplete="off"
        />
      </label>
      {showDropdown ? (
        <ul
          className="absolute top-full right-4 left-4 z-20 mt-1 max-h-64 overflow-auto rounded-xl border border-border bg-popover py-1 shadow-md sm:right-6 sm:left-6"
          role="listbox"
        >
          {results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              {noResultsLabel}
            </li>
          ) : (
            results.map((feature) => (
              <li key={feature.properties.id}>
                <button
                  type="button"
                  role="option"
                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted cursor-pointer"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelect(feature.properties.id)}
                >
                  {getProvinceDisplayName(feature, locale)}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
};
