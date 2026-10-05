"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { getMessages } from "./messages";
import type { Locale } from "@/features/map/types";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: ReturnType<typeof getMessages>;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "didi-locale";

const localeListeners = new Set<() => void>();

function subscribeToLocale(onStoreChange: () => void) {
  localeListeners.add(onStoreChange);

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      onStoreChange();
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    localeListeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

function readStoredLocale(): Locale {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "vi") {
    return stored;
  }
  return "vi";
}

function getLocaleSnapshot(): Locale {
  return readStoredLocale();
}

function getLocaleServerSnapshot(): Locale {
  return "vi";
}

function notifyLocaleStoreChange() {
  localeListeners.forEach((listener) => listener());
}

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getLocaleSnapshot,
    getLocaleServerSnapshot,
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
    notifyLocaleStoreChange();
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: getMessages(locale),
    }),
    [locale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
