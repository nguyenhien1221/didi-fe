"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "cn";
import { getMessages } from "@/i18n/messages";
import { getProvinceDisplayName } from "@/features/map/map-geo";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useMemo, useState } from "react";

import {
  DEFAULT_PROVINCE_TAB,
  PROVINCE_GALLERY_INDEXES,
  PROVINCE_TAB_LAYOUT_ID,
  provinceCardEntranceTransition,
  provinceCoverImageUrl,
  provinceGalleryImageUrl,
  provinceHeroImageTransition,
  provinceTabIndicatorTransition,
  staggerContainer,
  staggerItem,
  tabPanelTransition,
} from "./constants";
import type { ProvinceInfoCardProps, ProvinceTab } from "./types";
import { TripSuggestionItem } from "./trip-suggestion-item";
import { getTripSuggestionsForProvince } from "./trip-suggestions";

export const ProvinceInfoCard = ({
  locale,
  province,
  selectedTripId = null,
  onTripSelect,
}: ProvinceInfoCardProps) => {
  const [activeTab, setActiveTab] = useState<ProvinceTab>(DEFAULT_PROVINCE_TAB);

  const name = getProvinceDisplayName(province, locale);
  const imageUrl = provinceCoverImageUrl(province.properties.id);
  const t = getMessages(locale);

  const tabs: { id: ProvinceTab; label: string }[] = [
    { id: "info", label: t.provinceTabInfo },
    { id: "images", label: t.provinceTabImages },
    { id: "travel", label: t.provinceTabTravel },
  ];

  const tripSuggestions = useMemo(
    () =>
      getTripSuggestionsForProvince(
        province.properties.id,
        province.properties.name,
        province.properties.nameEn,
      ),
    [
      province.properties.id,
      province.properties.name,
      province.properties.nameEn,
    ],
  );

  const gallerySeeds = useMemo(
    () =>
      PROVINCE_GALLERY_INDEXES.map(
        (i) => `${province.properties.id}-gallery-${i}`,
      ),
    [province.properties.id],
  );

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={provinceCardEntranceTransition}
    >
      <Card className="flex h-full min-h-0 flex-col gap-0 overflow-hidden bg-card py-0 ring-border/60">
        <motion.div
          className="relative h-[min(10rem,28vh)] w-full shrink-0 overflow-hidden bg-muted md:aspect-video md:h-auto"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={provinceHeroImageTransition}
        >
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 448px"
            className="object-cover"
          />``
        </motion.div>
        <CardHeader className="shrink-0 gap-0 border-t border-border/60 pb-0">
          <CardTitle className="py-3 text-lg">{name}</CardTitle>
          <nav
            className="-mx-(--card-spacing) flex border-b border-border/60 px-(--card-spacing)"
            aria-label={t.provinceTabInfo}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative flex-1 px-2 py-2.5 text-center text-sm font-medium transition-colors cursor-pointer",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {tab.label}
                  {isActive ? (
                    <motion.span
                      layoutId={PROVINCE_TAB_LAYOUT_ID}
                      className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary"
                      transition={provinceTabIndicatorTransition}
                    />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 overflow-y-auto pb-4">
          <AnimatePresence mode="wait" initial={false}>
            {activeTab === "info" ? (
              <motion.div
                key="info"
                className="space-y-2 pt-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={tabPanelTransition}
              >
                <motion.p
                  className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
                  variants={staggerItem}
                  initial="hidden"
                  animate="show"
                >
                  {t.tripSuggestionsLabel}
                </motion.p>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  className="space-y-2"
                >
                  {tripSuggestions.map((trip) => (
                    <motion.div key={trip.id} variants={staggerItem}>
                      <TripSuggestionItem
                        locale={locale}
                        trip={trip}
                        isSelected={selectedTripId === trip.id}
                        onSelect={onTripSelect}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ) : null}
            {activeTab === "images" ? (
              <motion.div
                key="images"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={tabPanelTransition}
              >
                <motion.div
                  className="grid grid-cols-2 gap-2 pt-4"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                >
                  {gallerySeeds.map((seed) => (
                    <motion.div
                      key={seed}
                      variants={staggerItem}
                      className="relative aspect-4/3 overflow-hidden rounded-lg bg-muted"
                    >
                      <Image
                        src={provinceGalleryImageUrl(seed)}
                        alt=""
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ) : null}
            {activeTab === "travel" ? (
              <motion.p
                key="travel"
                className="pt-4 text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={tabPanelTransition}
              >
                {t.provinceTabTravelPlaceholder}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};
