import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { OpenNewWindow } from "iconoir-react";
import { TestEnglishButton } from "@/components/analytics/test-english-button";
import { ContactButton } from "@/components/contact/contact-dialog";

type Point = { title: string; description: string };

function Pillar({
  label,
  title,
  points,
  action,
}: {
  label: string;
  title: string;
  points: Point[];
  action: ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-card border border-navy/10 bg-paper p-7 sm:p-9">
      <p className="font-board text-xs font-semibold tracking-[0.2em] text-sky-ink uppercase">
        {label}
      </p>
      <h3 className="mt-3 font-display text-2xl font-extrabold text-navy">
        {title}
      </h3>

      <ol className="mt-7 flex-1 space-y-6">
        {points.map((point, i) => (
          <li key={point.title} className="flex gap-4">
            <span
              aria-hidden
              className="font-board text-sm leading-7 font-semibold text-red"
            >
              0{i + 1}
            </span>
            <div>
              <h4 className="font-display text-lg font-bold text-navy">
                {point.title}
              </h4>
              <p className="mt-1 text-sm leading-relaxed text-slate">
                {point.description}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8">{action}</div>
    </div>
  );
}

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <section id="how-it-works" className="bg-ivory py-14 sm:py-24">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2">
          <Pillar
            label={t("students.label")}
            title={t("students.title")}
            points={t.raw("students.points") as Point[]}
            action={
              <>
                <div className="flex flex-wrap gap-3">
                  <ContactButton
                    source="students_card"
                    variant="primary"
                    size="md"
                  >
                    {t("students.cta")}
                  </ContactButton>
                  <TestEnglishButton
                    source="students_card"
                    variant="secondary"
                    size="md"
                    aria-label={`${t("students.testCta")} (${t("students.opensNewTab")})`}
                  >
                    {t("students.testCta")}
                    <OpenNewWindow className="size-4" aria-hidden />
                  </TestEnglishButton>
                </div>
                <p className="mt-3 max-w-md text-xs leading-relaxed text-slate">
                  {t("students.testNote")}
                </p>
              </>
            }
          />
          <Pillar
            label={t("corporates.label")}
            title={t("corporates.title")}
            points={t.raw("corporates.points") as Point[]}
            action={
              <Button href="/corporates" variant="primary" size="md">
                {t("corporates.cta")}
              </Button>
            }
          />
        </div>
      </Container>
    </section>
  );
}
