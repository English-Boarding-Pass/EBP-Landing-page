import { useTranslations } from "next-intl";
import { NavArrowDown } from "iconoir-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

type FaqItem = { question: string; answer: string };

export function Faq() {
  const t = useTranslations("faq");
  const items = t.raw("items") as FaqItem[];

  return (
    <section id="faq" className="bg-white py-20 sm:py-28">
      <Container className="max-w-3xl">
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mx-auto"
        />

        <div className="mt-12 divide-y divide-navy/10 border-y border-navy/10">
          {items.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-bold text-navy marker:content-none">
                {item.question}
                <NavArrowDown
                  aria-hidden
                  className="size-5 shrink-0 text-sky-ink transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
