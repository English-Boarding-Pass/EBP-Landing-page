# Translation status

- `en.json` is the source copy. It was rewritten after the 4 Oct 2026 content meeting: about a fifth shorter where sections stayed, no em dashes, plain human wording. Keep new copy to the same rules.
- `si.json` is the Sinhala version, in casual spoken Colombo/youth register: contracted verb forms ("ඉවර කරලා" not "අවසන් කර"), informal "ඔයා" throughout, and everyday English loanwords where that's how people talk (ටීචර්, ජොබ්, ඉන්ටර්ව්ව්). The new sections (corporates, the science page, the reworked FAQ) are an **AI draft and need native-speaker review** before launch: register consistency, idiom, and the skill and CEFR level names on the science page, which are the most formal vocabulary on the site.
- `ta.json` is the Tamil version, same approach: casual spoken register with `-ங்க` verb endings, contracted forms, and common loanwords (டீச்சர், கிளாஸ், இன்டர்வியூ). The new sections are likewise an **AI draft and need native-speaker review**, plus a regional-dialect check (Jaffna vs. Colombo Tamil usage). Sri Lankan Tamil and Tamil Nadu Tamil differ, and this was written without native fluency in either.

The agreed process: finalise English first, then draft Sinhala and Tamil, then review each in a shared Google folder with one document per language.

All three files must share an identical key structure. `npm run check:i18n` checks this. Add new copy to `en.json` first, then mirror the same keys into `si.json` and `ta.json`. Aim for what a Sinhala or Tamil speaker would say at that point in the page, not a word-for-word mirror of the English.

Teacher profiles (`teachers.items`) are sample data in all three files until the real teachers send a photo, a short bio (20 words at most), a longer bio (about 50 words) and two student testimonials each. Testimonials must be about something that happened in the classroom.

Copy that was taken off the site in the rework is saved in `docs/removed-copy/`.

TODO translate (6 Oct 2026): these keys hold the English text in `si.json` and `ta.json` as a placeholder, so the UI never shows a missing key. Replace them in the translation pass: the whole `privacy` block, `teachers.readMoreAbout`, and `footer.social.linkedin`, `footer.social.facebook` and `footer.social.instagram`. JSON has no comments, so the TODO lives here.
