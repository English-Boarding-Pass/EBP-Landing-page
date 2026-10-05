import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ContactButton } from "@/components/contact/contact-dialog";
import { DepartureBoard } from "@/components/boarding-pass/departure-board";

export function Hero() {
  const t = useTranslations("hero");

  const skills = t.raw("skills") as string[];

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-navy pt-14 pb-20 sm:pt-20 sm:pb-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(156,204,246,0.18),transparent_55%)]"
      />
      <Container className="relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <h1 className="font-display text-4xl leading-[1.05] font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <span
            aria-hidden
            className="mt-6 block h-1.5 w-20 rounded-full bg-red"
          />
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            {t("subtitle")}
          </p>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-white/65">
            {t("audience")}
          </p>

          {/*
            Always a vertical stack, on every breakpoint and every locale.
            Sinhala/Tamil CTA labels run noticeably longer than English, so
            letting this flip between a row and a wrapped stack depending on
            whether the pair fits made the hero visibly reflow when the
            language switched. A fixed structure keeps the page feeling the
            same shape across languages. It grows a little taller for
            longer translations, but it doesn't rearrange itself.
          */}
          <div className="mt-9 flex flex-col items-start gap-3">
            <ContactButton variant="accent" size="lg">
              {t("cta")}
            </ContactButton>
            <Button href="/corporates" variant="outline-inverted" size="lg">
              {t("ctaSecondary")}
            </Button>
          </div>
        </div>

        {/* Nudged past the container edge on wide screens; kept small at lg so it never clips. */}
        <div className="flex justify-center lg:translate-x-4 lg:justify-end xl:translate-x-12">
          <DepartureBoard
            label={t("board.label")}
            gate={t("board.gate")}
            gateValue={t("board.gateValue")}
            status={t("board.status")}
            statusValue={t("board.statusValue")}
            columns={{
              flight: t("board.columns.flight"),
              skill: t("board.columns.skill"),
            }}
            rows={skills.map((skill, i) => ({
              code: `EBP 0${i + 1}`,
              skill,
            }))}
            destination={t("board.destination")}
            destinationValue={t("board.destinationValue")}
          />
        </div>
      </Container>
    </section>
  );
}
