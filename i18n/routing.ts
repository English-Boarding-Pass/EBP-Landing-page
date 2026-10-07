import { defineRouting } from "next-intl/routing";

export const locales = ["en", "si", "ta"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// `compact` is for the phone header, where the three full names don't fit
// beside the logo. Each stays in its own script so it is recognisable to
// someone who reads only that language.
export const localeLabels: Record<Locale, { native: string; compact: string }> =
  {
    en: { native: "English", compact: "EN" },
    si: { native: "සිංහල", compact: "සිං" },
    ta: { native: "தமிழ்", compact: "தமி" },
  };

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});
