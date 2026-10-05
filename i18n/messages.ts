import type { Locale } from "@/features/map/types";

export const messages = {
  vi: {
    siteName: "DiDi",
    searchPlaceholder: "Tìm tỉnh, thành phố…",
    searchNoResults: "Không tìm thấy kết quả",
    language: "Ngôn ngữ",
    mapResetHint: "Nhấn vùng trống để xem toàn quốc",
    mapBackToCountry: "Xem toàn quốc",
    provinceTabInfo: "Thông tin",
    provinceTabImages: "Hình ảnh",
    provinceTabTravel: "Di chuyển",
    provinceTabImagesPlaceholder: "Thư viện ảnh đang được cập nhật.",
    provinceTabTravelPlaceholder: "Hướng dẫn di chuyển sẽ sớm có.",
    tripSuggestionsLabel: "Gợi ý cho bạn",
    tripDetailPlaceholder: "Nội dung chi tiết tour sẽ sớm có.",
    tripItineraryLabel: "Lịch trình",
    tripDetailClose: "Đóng chi tiết tour",
    tripBackHome: "Quay lại bản đồ",
  },
  en: {
    siteName: "DiDi",
    searchPlaceholder: "Search province or city…",
    searchNoResults: "No results found",
    language: "Language",
    mapResetHint: "Click empty area to view full map",
    mapBackToCountry: "View full country",
    provinceTabInfo: "Information",
    provinceTabImages: "Images",
    provinceTabTravel: "Getting around",
    provinceTabImagesPlaceholder: "Photo gallery coming soon.",
    provinceTabTravelPlaceholder: "Travel directions coming soon.",
    tripSuggestionsLabel: "Suggested for you",
    tripDetailPlaceholder: "Full tour details coming soon.",
    tripItineraryLabel: "Itinerary",
    tripDetailClose: "Close trip details",
    tripBackHome: "Back to map",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export function getMessages(locale: Locale) {
  return messages[locale];
}
