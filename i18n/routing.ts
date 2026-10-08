import { defineRouting } from "next-intl/routing";

export const locales = ["en", "si", "ta"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, { native: string; short: string }> = {
  en: { native: "English", short: "EN" },
  si: { native: "සිංහල", short: "SI" },
  ta: { native: "தமிழ்", short: "TA" },
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});
