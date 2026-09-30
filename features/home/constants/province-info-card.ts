import type { Transition, Variants } from "motion/react";

const easeOut = [0.22, 1, 0.36, 1] as const;

export const PROVINCE_COVER_IMAGE = {
  width: 640,
  height: 360,
} as const;

export const PROVINCE_GALLERY_IMAGE = {
  width: 400,
  height: 300,
} as const;

export const PROVINCE_GALLERY_INDEXES = [0, 1, 2, 3] as const;

export const PROVINCE_TAB_LAYOUT_ID = "province-tab-indicator";

export const DEFAULT_PROVINCE_TAB = "info" as const;

export const provinceCoverImageUrl = (provinceId: string) =>
  `https://picsum.photos/seed/province-${provinceId}/${PROVINCE_COVER_IMAGE.width}/${PROVINCE_COVER_IMAGE.height}`;

export const provinceGalleryImageUrl = (seed: string) =>
  `https://picsum.photos/seed/${seed}/${PROVINCE_GALLERY_IMAGE.width}/${PROVINCE_GALLERY_IMAGE.height}`;

export const provinceCardEntranceTransition: Transition = {
  duration: 0.35,
  ease: easeOut,
};

export const provinceHeroImageTransition: Transition = {
  duration: 0.55,
  ease: easeOut,
};

export const provinceTabIndicatorTransition: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 32,
};

export const tabPanelTransition: Transition = {
  duration: 0.22,
  ease: easeOut,
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: easeOut },
  },
};
