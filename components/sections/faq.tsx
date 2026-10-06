import { useLocale, useTranslations } from "next-intl";
import { NavArrowDown, NavArrowRight, Whatsapp } from "iconoir-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { whatsappUrl } from "@/lib/site";
import { SectionHeading } from "@/components/ui/section-heading";

type FaqItem = {
  question: string;
  answer: string;
  points?: string[];
  /** Label for a link to the programmes section. */
  link?: string;
};

export function Faq() {
  const t = useTranslations("faq");
  const tFooter = useTranslations("footer");
  const locale = useLocale();
  const items = t.raw("items") as FaqItem[];

  return (
    <section id="faq" className="bg-paper py-16 sm:py-28">
      <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        {/* The WhatsApp button answers the subtitle and gives the column some weight. */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />
          <Button
            href={whatsappUrl}
            variant="primary"
            size="md"
            className="mt-6"
          >
            <Whatsapp className="size-4" aria-hidden />
            {tFooter("columns.contact.whatsapp")}
          </Button>
        </div>

        <div className="divide-y divide-navy/10 border-y border-navy/10">
          {items.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-lg font-display text-base font-bold text-navy marker:content-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:outline-none">
                {item.question}
                <NavArrowDown
                  aria-hidden
                  className="size-5 shrink-0 text-sky-ink transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate">
                {item.answer}
              </p>
              {item.points ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate marker:text-red">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
              {item.link ? (
                <a
                  href={`/${locale}#programmes`}
                  className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-full text-sm font-semibold text-sky-ink underline underline-offset-4 hover:text-navy focus-visible:ring-2 focus-visible:ring-navy focus-visible:outline-none"
                >
                  {item.link}
                  <NavArrowRight className="size-4" aria-hidden />
                </a>
              ) : null}
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
