import {
  Manrope,
  DM_Sans,
  Noto_Sans_Sinhala,
  Noto_Sans_Tamil,
  JetBrains_Mono,
} from "next/font/google";

// Primary typeface: H1/H2 only, per brand guidelines.
export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

// Secondary typeface: logo, body, buttons & tagline.
export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

// Paired with DM Sans / Manrope for translated Sinhala content. Loaded
// globally (not per-locale) so the font-family fallback chain in
// globals.css can resolve Sinhala glyphs even when Latin brand terms
// (prices, "English Boarding Pass") sit inside the same string.
export const notoSansSinhala = Noto_Sans_Sinhala({
  subsets: ["sinhala"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-si",
  display: "swap",
});

// Paired with DM Sans / Manrope for translated Tamil content.
export const notoSansTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-ta",
  display: "swap",
});

// Not part of the brand guidelines' two typefaces: used narrowly for the
// boarding-pass motif's flight-board details (dates, seat counts, route
// codes), never for body copy.
export const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-mono-board",
  display: "swap",
});

export const fontVariables = [
  manrope.variable,
  dmSans.variable,
  notoSansSinhala.variable,
  notoSansTamil.variable,
  jetBrainsMono.variable,
].join(" ");
