# EBP-Landing-page

Landing page for English Boarding Pass: Next.js 16 (App Router), TypeScript, Tailwind CSS v4 and `next-intl` (English, Sinhala, Tamil).

## Getting started

Requires Node.js 20.9+ (see `.nvmrc`).

```sh
npm install
npm run dev      # http://localhost:3000
```

| Script               | What it does                                             |
| -------------------- | -------------------------------------------------------- |
| `npm run dev`        | Start the dev server                                     |
| `npm run build`      | Production build                                         |
| `npm run lint`       | ESLint                                                   |
| `npm run typecheck`  | TypeScript check (`tsc --noEmit`)                        |
| `npm run format`     | Format everything with Prettier                          |
| `npm run check:i18n` | Check `en.json`, `si.json` and `ta.json` share every key |

## Pages

| Route                  | What it is                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `/[locale]`            | Home: hero, how it works (students and corporates), teachers, FAQ                  |
| `/[locale]/corporates` | Corporate landing page with its own enquiry form. QR codes and proposals link here |
| `/[locale]/science`    | "The science behind English": the four skills, the CEFR scale, the progression     |

All copy lives in `messages/*.json`. Sections removed in the October 2026 content rework (pricing, course cards, placeholder testimonials) are saved in [docs/removed-copy/](docs/removed-copy/).

Teacher profiles live in `teachers.items` in each `messages/*.json`: a name, a bio of about 50 words and up to five student reviews (they open in a popup). The row shows three tiles; teachers still to come fill the rest with a "profile coming soon" box. To add a teacher, add an item to each file, put the photo in `public/teachers/` and list its path in the `photos` array in [components/sections/teachers.tsx](components/sections/teachers.tsx), in the same order.

The WhatsApp number and contact email in [lib/site.ts](lib/site.ts) are placeholders.

## Enquiry forms (Resend)

There are two forms, both handled by server actions in [lib/enquiry.ts](lib/enquiry.ts):

- **Get in touch**: every "Get in touch" button opens a popup ([components/contact/contact-dialog.tsx](components/contact/contact-dialog.tsx)) asking for name, email and phone number, with an optional message.
- **Corporate enquiry**: the form on the corporate page ([components/corporates/enquiry-form.tsx](components/corporates/enquiry-form.tsx)). Name, company, email and phone are required; number of learners, current level, job role and message are optional.

Each submission:

1. saves the person as a [Resend](https://resend.com) contact (into `RESEND_AUDIENCE_ID` if set),
2. emails them a confirmation in the language they used on the site,
3. emails `WAITLIST_NOTIFY_EMAIL` with everything they entered, if set. (The variable keeps its old name so existing deployments carry on working.)

A submission only shows an error when both step 1 and step 3 failed, so a key with "Sending access" only still works: enquiries then reach the inbox but not the contact list.

Both forms are rate limited: 5 enquiries per visitor in 10 minutes and 3 per email address in an hour, after which the form asks the person to wait. The limiter ([lib/rate-limit.ts](lib/rate-limit.ts)) keeps its counts in memory, so it needs no database but only counts within one running server; that file explains the trade-off and how to swap in a shared store if abuse ever shows up. A hidden honeypot field catches simple bots before any of this.

The confirmation email's design lives in [lib/emails/enquiry-confirmation.ts](lib/emails/enquiry-confirmation.ts) and its text in the `contact.email` keys of `messages/*.json`. Until a domain is verified at [resend.com/domains](https://resend.com/domains), Resend's test sender can only deliver to the Resend account's own address, so in practice only the team email (step 3) arrives; step 2 fails and is logged.

Copy [.env.example](.env.example) to `.env.local` and fill it in; on Vercel, add the same variables under **Settings → Environment Variables**. Without `RESEND_API_KEY`, the forms still work locally (enquiries are only logged to the terminal) but show an error in production.

## Deploying

Connect the repository to [Vercel](https://vercel.com/new) and add the environment variables from `.env.example` under **Settings > Environment Variables**. Vercel supports the `next-intl` middleware (`proxy.ts`) with no extra setup.
