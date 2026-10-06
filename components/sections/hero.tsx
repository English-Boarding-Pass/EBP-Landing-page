import { useTranslations } from "next-intl";
import { NavArrowRight } from "iconoir-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ContactButton } from "@/components/contact/contact-dialog";
import { DepartureBoard } from "@/components/boarding-pass/departure-board";

export function Hero() {
  const t = useTranslations("hero");

  const skills = t.raw("skills") as string[];

  return (
    <section id="top" className="bg-navy pt-20 pb-20 sm:pt-28 sm:pb-28">
      <Container className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <h1 className="font-display text-[clamp(2.25rem,1.2rem+4.5vw,3.75rem)] leading-[1.05] font-extrabold tracking-tight text-white">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            {t("subtitle")}
          </p>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-white/65">
            {t("audience")}
          </p>

          {/*
            Two buttons of one size, side by side from 480px up (whole buttons
            wrap, labels never do: Button is nowrap). Below 480px they stack
            full width, primary first. The accent button carries a clear
            border so both are the same height.
          */}
          <div className="mt-9 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:flex-wrap min-[480px]:items-center">
            <ContactButton
              source="hero"
              variant="accent"
              size="lg"
              className="w-full border border-transparent min-[480px]:w-auto"
            >
              {t("cta")}
            </ContactButton>
            <Button
              href="/corporates"
              variant="outline-inverted"
              size="lg"
              className="w-full min-[480px]:w-auto"
            >
              {t("ctaSecondary")}
              <NavArrowRight className="size-4" aria-hidden />
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
