import { useTranslations } from "next-intl";
import { Quote } from "iconoir-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

type Testimonial = { quote: string; name: string; role: string };

export function Testimonials() {
  const t = useTranslations("testimonials");
  const items = t.raw("items") as Testimonial[];

  return (
    <section className="bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {items.map((item) => (
            <figure
              key={item.name}
              className="flex flex-col rounded-card border border-navy/10 bg-ivory p-7"
            >
              <Quote className="size-6 text-sky-ink" aria-hidden />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-navy">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-5 border-t border-navy/10 pt-4">
                <p className="font-display text-sm font-bold text-navy">
                  {item.name}
                </p>
                <p className="text-xs text-slate">{item.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
