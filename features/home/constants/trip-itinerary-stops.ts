/** Per-province day stops (vi/en pairs) until API data exists. */
export const PROVINCE_ITINERARY_STOPS: Record<
  string,
  { vi: string[]; en: string[] }
> = {
  "04": {
    vi: [
      "Thành phố Cao Bằng",
      "Suối Lê-nin",
      "Thác Bản Giốc",
      "Hồ Ba Bể",
      "Động Ngườm Ngao",
    ],
    en: [
      "Cao Bang City",
      "Lenin Stream",
      "Ban Gioc Waterfall",
      "Ba Be Lake",
      "Nguom Ngao Cave",
    ],
  },
};

export const GENERIC_ITINERARY_STOP_SUFFIXES_VI = [
  "trung tâm",
  "phố cổ",
  "điểm ngắm",
  "check-in view",
  "chợ địa phương",
];

export const GENERIC_ITINERARY_STOP_SUFFIXES_EN = [
  "city center",
  "old quarter",
  "scenic spot",
  "viewpoint",
  "local market",
];
