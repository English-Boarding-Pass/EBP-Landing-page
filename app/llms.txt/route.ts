import { locales } from "@/i18n/routing";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

// A plain text summary of the site for AI tools (the llms.txt convention).
// It is optional and no major engine has promised to use it; it costs
// nothing and gives a model the key facts and pages in one place.
export const dynamic = "force-static";

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  si: "Sinhala",
  ta: "Tamil",
};

export function GET() {
  const pages = locales
    .map((locale) => {
      const language = LANGUAGE_NAMES[locale] ?? locale;
      return [
        `- [Home, ${language}](${SITE_URL}/${locale}): what English Boarding Pass offers, how it works, teachers and common questions`,
        `- [For corporates, ${language}](${SITE_URL}/${locale}/corporates): tailored English courses for companies, with an enquiry form`,
        `- [The science, ${language}](${SITE_URL}/${locale}/science): the four skills of English, the CEFR scale and how lessons are built`,
      ].join("\n");
    })
    .join("\n");

  const body = `# English Boarding Pass

> English that takes you places. English Boarding Pass teaches English in Sri Lanka, with experienced Sri Lankan teachers who explain in Sinhala or Tamil. It serves individual students and builds tailored English courses for companies.

## Key facts

- Country: Sri Lanka
- Languages of the site and of teaching support: English, Sinhala, Tamil
- Audiences: individual learners, and companies that want English training for their teams
- Classes can be arranged online or in person
- Fees are agreed directly with each student or company
- Learners can try a free Cambridge English test of 25 questions and send their mark when they get in touch
- Contact: ${CONTACT_EMAIL}

## Pages

${pages}

## Machine readable

- [Sitemap](${SITE_URL}/sitemap.xml)
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
