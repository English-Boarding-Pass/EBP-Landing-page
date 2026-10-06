import { clsx } from "clsx";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import {
  EvaluationIllustration,
  TailoredIllustration,
  WorkplaceIllustration,
} from "@/components/corporates/illustrations";

type Pillar = { title: string; description: string };

// Same order as corporates.pillars in messages/*.json.
const illustrations = [
  TailoredIllustration,
  WorkplaceIllustration,
  EvaluationIllustration,
];

export function CorporatePillars() {
  const t = useTranslations("corporates");
  const pillars = t.raw("pillars") as Pillar[];

  return (
    <section className="bg-ivory py-14 sm:py-24">
      <Container className="space-y-16 sm:space-y-24">
        {pillars.map((pillar, i) => {
          const Illustration = illustrations[i];
          return (
            <div
              key={pillar.title}
              className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
            >
              <div className={clsx(i % 2 === 1 && "lg:order-2")}>
                <Illustration />
              </div>
              <div>
                <span
                  aria-hidden
                  className="font-board text-sm font-semibold text-red"
                >
                  0{i + 1}
                </span>
                <h2 className="mt-3 font-display text-[clamp(1.875rem,1.4rem+2vw,2.25rem)] font-extrabold tracking-tight text-navy">
                  {pillar.title}
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-slate sm:text-lg">
                  {pillar.description}
                </p>
              </div>
            </div>
          );
        })}
      </Container>
    </section>
  );
}
