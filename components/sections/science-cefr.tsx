import type { CSSProperties } from "react";
import { clsx } from "clsx";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

type Level = { code: string; name: string; description: string };

// The scale's three bands (A basic, B independent, C proficient) get darker
// as they climb.
const bandClasses = [
  "bg-ice text-sky-ink",
  "bg-sky text-navy",
  "bg-navy text-white",
];

/** Element two: how ability is measured, as a six-step climb from A1 to C2. */
export function ScienceCefr() {
  const t = useTranslations("science.cefr");
  const levels = t.raw("levels") as Level[];

  return (
    <section className="bg-paper py-16 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="02"
          title={t("title")}
          subtitle={t("body")}
          className="max-w-3xl"
        />

        {/* On wide screens each step stands taller than the last, so the row reads as stairs. */}
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:items-end">
          {levels.map((level, i) => (
            <li
              key={level.code}
              style={{ "--step": i } as CSSProperties}
              className="rounded-card border border-navy/10 bg-ivory p-5 lg:min-h-[calc(13rem_+_var(--step)_*_1.5rem)]"
            >
              <span
                className={clsx(
                  "inline-flex h-9 items-center rounded-full px-3.5 font-board text-sm font-semibold",
                  bandClasses[Math.floor(i / 2)],
                )}
              >
                {level.code}
              </span>
              <h3 className="mt-3 font-display text-base font-bold text-navy">
                {level.name}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate">
                {level.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
