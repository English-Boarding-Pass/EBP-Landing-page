# Fonts

The site's fonts are kept here and loaded with `next/font/local` in [lib/fonts.ts](../../lib/fonts.ts), so a build never has to reach Google Fonts.

Each file is the variable `woff2` that Google Fonts served for the family and subset below on 8 Oct 2026.

| File                              | Family            | Version | Subset  | Weights used  |
| --------------------------------- | ----------------- | ------- | ------- | ------------- |
| `manrope-latin.woff2`             | Manrope           | v20     | latin   | 700, 800      |
| `dm-sans-latin.woff2`             | DM Sans           | v17     | latin   | 400, 500, 700 |
| `noto-sans-sinhala-sinhala.woff2` | Noto Sans Sinhala | v36     | sinhala | 400, 500, 700 |
| `noto-sans-tamil-tamil.woff2`     | Noto Sans Tamil   | v31     | tamil   | 400, 500, 700 |
| `jetbrains-mono-latin.woff2`      | JetBrains Mono    | v24     | latin   | 500, 600      |

Only these subsets are kept. The Sinhala and Tamil files hold that script alone; Latin text in a Sinhala or Tamil page comes from Manrope and DM Sans, which sit first in the font stack. Characters outside these subsets (Latin Extended, Cyrillic and so on) fall back to the visitor's system font.

## Updating a font

Open `https://fonts.googleapis.com/css2?family=<Family>:wght@<weights>&display=swap` in a browser, find the `@font-face` block for the subset, download the `woff2` it points to and replace the file here. If Google changed the subset's `unicode-range`, copy the new value into `lib/fonts.ts`.

## Licence

All five families are under the SIL Open Font License 1.1, which allows bundling them with the site. The licence requires its text to travel with the files: see the `OFL-*.txt` file for each family in this folder.
