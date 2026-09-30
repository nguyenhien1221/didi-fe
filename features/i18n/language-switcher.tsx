"use client";

import { Button } from "@/components/ui/button";

import { useLocale } from "./locale-context";
import type { Locale } from "@/features/map/types";

const options: { value: Locale; label: string }[] = [
  { value: "vi", label: "VI" },
  { value: "en", label: "EN" },
];

export const LanguageSwitcher = () => {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      className="flex items-center gap-1"
      role="group"
      aria-label={t.language}
    >
      {options.map((option) => (
        <Button
          key={option.value}
          type="button"
          size="sm"
          variant={locale === option.value ? "default" : "outline"}
          onClick={() => setLocale(option.value)}
          aria-pressed={locale === option.value}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};
