import localFont from "next/font/local";

// The font files live in assets/fonts/ instead of being fetched from Google
// at build time. Google Fonts occasionally answers in a form the bundler
// can't read, which failed builds and broke the dev server; local files can't
// do that. They are the same woff2 files Google served for this setup (see
// assets/fonts/README.md), so the site looks exactly as it did.
//
// Every file is a variable font. Each weight the site uses is still declared
// on its own, so a weight in between (font-semibold on DM Sans, say) keeps
// resolving to the next declared weight, as it did with next/font/google.
//
// `unicode-range` is the set of characters Google ships in that subset.
// Declaring it means a browser only downloads a font when the page has
// characters it covers. The font loader only accepts literal values, which is
// why the paths and ranges are written out in full each time.

// Primary typeface: H1/H2 only, per brand guidelines.
export const manrope = localFont({
  src: [
    { path: "../assets/fonts/manrope-latin.woff2", weight: "700" },
    { path: "../assets/fonts/manrope-latin.woff2", weight: "800" },
  ],
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
  variable: "--font-manrope",
  display: "swap",
});

// Secondary typeface: logo, body, buttons & tagline.
export const dmSans = localFont({
  src: [
    { path: "../assets/fonts/dm-sans-latin.woff2", weight: "400" },
    { path: "../assets/fonts/dm-sans-latin.woff2", weight: "500" },
    { path: "../assets/fonts/dm-sans-latin.woff2", weight: "700" },
  ],
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});

// Paired with DM Sans / Manrope for translated Sinhala content. Loaded
// globally (not per-locale) so the font-family fallback chain in
// globals.css can resolve Sinhala glyphs even when Latin brand terms
// (prices, "English Boarding Pass") sit inside the same string.
export const notoSansSinhala = localFont({
  src: [
    { path: "../assets/fonts/noto-sans-sinhala-sinhala.woff2", weight: "400" },
    { path: "../assets/fonts/noto-sans-sinhala-sinhala.woff2", weight: "500" },
    { path: "../assets/fonts/noto-sans-sinhala-sinhala.woff2", weight: "700" },
  ],
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0964-0965, U+0D81-0DF4, U+1CF2, U+200C-200D, U+25CC, U+111E1-111F4",
    },
  ],
  variable: "--font-noto-si",
  display: "swap",
  // The file holds Sinhala glyphs only, so there are no Latin metrics to
  // size an Arial fallback from. Latin text never reaches this font anyway.
  adjustFontFallback: false,
});

// Paired with DM Sans / Manrope for translated Tamil content.
export const notoSansTamil = localFont({
  src: [
    { path: "../assets/fonts/noto-sans-tamil-tamil.woff2", weight: "400" },
    { path: "../assets/fonts/noto-sans-tamil-tamil.woff2", weight: "500" },
    { path: "../assets/fonts/noto-sans-tamil-tamil.woff2", weight: "700" },
  ],
  declarations: [
    {
      prop: "unicode-range",
      value: "U+0964-0965, U+0B82-0BFA, U+200C-200D, U+20B9, U+25CC",
    },
  ],
  variable: "--font-noto-ta",
  display: "swap",
  // Tamil glyphs only: see the note on the Sinhala font above.
  adjustFontFallback: false,
});

// Not part of the brand guidelines' two typefaces: used narrowly for the
// boarding-pass motif's flight-board details (dates, seat counts, route
// codes), never for body copy.
export const jetBrainsMono = localFont({
  src: [
    { path: "../assets/fonts/jetbrains-mono-latin.woff2", weight: "500" },
    { path: "../assets/fonts/jetbrains-mono-latin.woff2", weight: "600" },
  ],
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
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
