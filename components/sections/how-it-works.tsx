import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

type Step = { number: string; title: string; description: string };

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const steps = t.raw("steps") as Step[];

  return (
    <section id="how-it-works" className="bg-ivory py-20 sm:py-28">
      <Container>
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mx-auto"
        />

        <ol className="mt-14 grid gap-8 sm:grid-cols-3 sm:gap-6">
          {steps.map((step, i) => (
            <li
              key={step.number}
              className="relative rounded-card border border-navy/10 bg-white p-7"
            >
              <span className="font-board text-sm font-semibold text-sky-ink">
                {step.number}
              </span>
              <h3 className="mt-3 font-display text-xl font-bold text-navy">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                {step.description}
              </p>
              {i < steps.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute top-1/2 right-[-1.35rem] hidden -translate-y-1/2 font-board text-lg text-navy/15 sm:block"
                >
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
