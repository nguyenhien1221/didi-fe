"use client";

import { LanguageSwitcher } from "@/features/i18n/language-switcher";
import { useLocale } from "@/features/i18n/locale-context";

export const HomeHeader = () => {
  const { t } = useLocale();

  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground"
          aria-hidden
        >
          D
        </div>
        <span className="text-lg font-semibold tracking-tight text-foreground">
          {t.siteName}
        </span>
      </div>
      <LanguageSwitcher />
    </header>
  );
};
