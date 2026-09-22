# Translation status

- `en.json` — source copy, final.
- `si.json` — Sinhala **transcreation**, not a literal translation. Written in casual spoken Colombo/youth register — contracted verb forms ("ඉවර කරලා" not "අවසන් කර"), informal "ඔයා" throughout, and everyday English loanwords where that's genuinely how people talk (ටීචර්, ලයිව්, බැච්, ඉන්ටර්ව්ව්, කන්ෆර්ම්). The goal is copy that sounds like a person wrote it, not copy that mirrors the English sentence-for-sentence. **Needs native-speaker review** before launch: register consistency, idiom, and whether the loanword density is right for the full target audience (not just urban youth).
- `ta.json` — Tamil transcreation, same approach: casual spoken register with `-ங்க` verb endings, contracted forms, and common loanwords (டீச்சர், லைவ், பேட்ச், இன்டர்வியூ, கன்ஃபர்ம்). **Needs native-speaker review** before launch: same notes as above, plus a regional-dialect check (Jaffna vs. Colombo Tamil usage) given the target audience — Sri Lankan Tamil and Tamil Nadu Tamil differ, and this was written without native fluency in either.

All three files share an identical key structure (verified — 92 keys each, no drift) — any new copy should be added to `en.json` first, then mirrored into `si.json` and `ta.json` with the same keys. Don't machine-translate the English into the other two; write what a Sinhala/Tamil speaker would actually say for that UI moment.

- `lib/route-native-copy.ts` — the route cards' tagline/description are **not** locale-switched. The Sinhala route always shows spoken Sinhala and the Tamil route always shows spoken Tamil, regardless of the active interface language, since the copy is a preview of the class itself. Same transcreation approach and same review need as above.
