import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactButton } from "@/components/contact/contact-dialog";

type Programme = { name: string; description: string };

/**
 * Names and short descriptions only. No prices: fees are agreed with each
 * learner or company directly, as the FAQ says.
 */
export function Programmes() {
  const t = useTranslations("programmes");
  const items = t.raw("items") as Programme[];

  return (
    <section id="programmes" className="bg-ivory py-16 sm:py-28">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <ul className="mt-12 divide-y divide-navy/10 border-y border-navy/10">
          {items.map((item) => (
            <li
              key={item.name}
              className="grid gap-2 py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10"
            >
              <h3 className="font-display text-xl font-extrabold text-navy">
                {item.name}
              </h3>
              <p className="text-base leading-relaxed text-slate">
                {item.description}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <ContactButton variant="primary" size="md">
            {t("cta")}
          </ContactButton>
        </div>
      </Container>
    </section>
  );
}
