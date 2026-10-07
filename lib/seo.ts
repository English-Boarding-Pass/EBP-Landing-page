import type { Metadata } from "next";
import { locales } from "@/i18n/routing";

// Open Graph wants a territory with the language.
const OG_LOCALES: Record<string, string> = {
  en: "en_LK",
  si: "si_LK",
  ta: "ta_LK",
};

// The picture shown when a link to the site is shared (WhatsApp, Facebook,
// LinkedIn, X). One image for every page and language: public/og.png.
const SHARE_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "English Boarding Pass: English That Takes You Places",
};

/**
 * What every page tells search engines and link previews about itself: its
 * one true address, the same page in the other two languages, and the title
 * and description to show when the link is shared.
 *
 * `path` is the part after the locale ("" for the home page). The addresses
 * are relative; the layout's `metadataBase` turns them into full URLs.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const url = `/${locale}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])),
        // Where to send someone whose language is none of the three.
        "x-default": `/en${path}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: "English Boarding Pass",
      title,
      description,
      url,
      locale: OG_LOCALES[locale],
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SHARE_IMAGE],
    },
  };
}
