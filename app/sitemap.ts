import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

// Every public page, as a path after the locale ("" is the home page).
const pages = ["", "/corporates", "/science"];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${page}`,
      changeFrequency: "monthly" as const,
      priority: page === "" ? 1 : 0.7,
      // Tells search engines the three languages are the same page.
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${SITE_URL}/${l}${page}`]),
        ),
      },
    })),
  );
}
