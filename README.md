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

## Waitlist (Resend)

Until the class platform is built, every "Join the waitlist" button opens a popup form on the same page ([components/waitlist/waitlist-dialog.tsx](components/waitlist/waitlist-dialog.tsx)) asking for name, email, phone number and route (Sinhala → English or Tamil → English). The route buttons pre-select their route. The server action in [lib/waitlist.ts](lib/waitlist.ts):

1. saves the person as a [Resend](https://resend.com) contact (into `RESEND_AUDIENCE_ID` if set),
2. emails them a confirmation in the language they used on the site,
3. emails `WAITLIST_NOTIFY_EMAIL` with their details (name, email, phone, route), if set.

A signup only shows an error when both step 1 and step 3 failed, so a key with "Sending access" only still works: signups then reach the inbox but not the contact list.

The confirmation email's design lives in [lib/emails/waitlist-confirmation.ts](lib/emails/waitlist-confirmation.ts) and its text in the `waitlist.email` keys of `messages/*.json`. Until a domain is verified at [resend.com/domains](https://resend.com/domains), Resend's test sender can only deliver to the Resend account's own address, so in practice only the admin email (step 3) arrives; step 2 fails and is logged.

Copy [.env.example](.env.example) to `.env.local` and fill it in; on Vercel, add the same variables under **Settings → Environment Variables**. Without `RESEND_API_KEY`, the form still works locally (signups are only logged to the terminal) but shows an error in production.

## Deploying

Connect the repository to [Vercel](https://vercel.com/new) and add the environment variables from `.env.example` under **Settings > Environment Variables**. Vercel supports the `next-intl` middleware (`proxy.ts`) with no extra setup.
