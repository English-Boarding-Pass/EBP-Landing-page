import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

type Step = { name: string; description: string };

/** Element three: the order we build a skill in, with grammar deliberately last. */
export function ScienceProgression() {
  const t = useTranslations("science.progression");
  const steps = t.raw("steps") as Step[];

  return (
    <section className="bg-ivory py-14 sm:py-24">
      <Container>
        <SectionHeading eyebrow="03" title={t("title")} subtitle={t("body")} />

        <ol className="mt-12 grid gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {steps.map((step, i) => {
            const last = i === steps.length - 1;
            return (
              <li
                key={step.name}
                className="relative rounded-card border border-navy/10 bg-paper p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-board text-sm font-semibold text-sky-ink">
                    0{i + 1}
                  </span>
                  {last ? (
                    <span className="rounded-full bg-red px-3 py-1 text-xs font-semibold text-white">
                      {t("lastLabel")}
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-3 font-display text-xl font-bold text-navy">
                  {step.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">
                  {step.description}
                </p>
                {!last ? (
                  <span
                    aria-hidden
                    className="absolute top-1/2 right-[-1.35rem] hidden -translate-y-1/2 font-board text-lg text-navy/15 lg:block"
                  >
                    →
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>

        <p className="mt-10 max-w-3xl border-l-4 border-red pl-5 text-base leading-relaxed text-navy sm:text-lg">
          {t("note")}
        </p>
      </Container>
    </section>
  );
}
