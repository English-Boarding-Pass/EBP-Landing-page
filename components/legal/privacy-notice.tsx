import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { CONTACT_EMAIL } from "@/lib/site";

type Section = {
  heading: string;
  paragraphs?: string[];
  items?: string[];
  closing?: string;
};

// Swaps the {email} placeholder for a real mailto link.
function withEmail(text: string) {
  const parts = text.split("{email}");
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 ? (
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-medium text-sky-ink underline underline-offset-4 hover:text-navy"
        >
          {CONTACT_EMAIL}
        </a>
      ) : null}
    </Fragment>
  ));
}

/**
 * The body of the privacy notice. It carries no title of its own so it can sit
 * inside the footer popup now and on a /privacy page later (the page adds its
 * own heading from the same `privacy.title` and `privacy.subtitle` strings).
 */
export function PrivacyNotice() {
  const t = useTranslations("privacy");
  const sections = t.raw("sections") as Section[];

  return (
    <div className="space-y-6 text-sm leading-relaxed text-slate">
      {sections.map((section) => (
        <section key={section.heading}>
          <h3 className="font-display text-base font-bold text-navy">
            {section.heading}
          </h3>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="mt-2">
              {withEmail(paragraph)}
            </p>
          ))}
          {section.items ? (
            <ul className="mt-2 list-disc space-y-1.5 pl-5 marker:text-red">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {section.closing ? <p className="mt-2">{section.closing}</p> : null}
        </section>
      ))}
    </div>
  );
}
