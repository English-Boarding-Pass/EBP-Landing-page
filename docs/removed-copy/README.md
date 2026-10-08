# Removed copy (phase 1 content rework, Oct 2026)

The content meeting on 4 Oct 2026 took several sections off the site for phase 1, with the note that they come back later. Their text is saved here so nobody has to rewrite it.

| File                    | What it is                                                                 |
| ----------------------- | -------------------------------------------------------------------------- |
| `en.json`               | The full English copy as it was before the rework                          |
| `si.json`               | The full Sinhala copy as it was before the rework                          |
| `ta.json`               | The full Tamil copy as it was before the rework                            |
| `route-native-copy.txt` | The course cards' Sinhala and Tamil taglines (was `lib/route-native-copy`) |

What was removed, by key in those files:

- `pricing`: the "Simple pricing, no surprises" section.
- `testimonials`: the "Students who found their words" section. These quotes were placeholders, not real students. Don't bring them back as they are.
- `routes`: the "Choose your route" course cards (Sinhala to English, Tamil to English), with cohort dates and seat counts.
- `howItWorks.steps`: the three-step version with "5 months" and "40 classes".
- `faq.items`: the "What if I miss a class?", "live or recorded" and instalment-payment answers.
- `waitlist`: the waitlist form and its confirmation email.
- `programmes`: the Programmes section (placeholder cards and "Ask about fees"), removed in the Oct 2026 review. Last commit with it: `b13bb74` (`git show b13bb74:components/sections/programmes.tsx`, copy in `messages/*.json` under `programmes`).

The components that rendered them (`pricing.tsx`, `testimonials.tsx`, `routes-section.tsx`, `route-card.tsx`, `barcode.tsx`, `perforation.tsx`, the waitlist dialog and its email) are in git history. The last commit that has them is `06d015a`:

```sh
git show 06d015a:components/sections/pricing.tsx
```

These files are not loaded by the site. Nothing here needs to stay in step with `messages/`.
