import { useTranslations } from "next-intl";
import { NavArrowRight } from "iconoir-react";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { ContactButton } from "@/components/contact/contact-dialog";
import { DepartureBoard } from "@/components/boarding-pass/departure-board";

export function Hero() {
  const t = useTranslations("hero");

  const skills = t.raw("skills") as string[];

  return (
    <section id="top" className="bg-navy pt-44 pb-20 sm:pt-40 sm:pb-28">
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
            Always a vertical stack, on every breakpoint and every locale.
            Sinhala/Tamil CTA labels run noticeably longer than English, so
            letting this flip between a row and a wrapped stack depending on
            whether the pair fits made the hero visibly reflow when the
            language switched. A fixed structure keeps the page feeling the
            same shape across languages. It grows a little taller for
            longer translations, but it doesn't rearrange itself.
          */}
          <div className="mt-9 flex flex-col items-start gap-2">
            <ContactButton variant="accent" size="lg">
              {t("cta")}
            </ContactButton>
            {/* A quiet text link: the hero belongs to individual learners. */}
            <Link
              href="/corporates"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full text-sm font-medium text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white hover:decoration-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              {t("ctaSecondary")}
              <NavArrowRight className="size-4" aria-hidden />
            </Link>
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
            // Speaking leads the list: live spoken English is what we teach.
            rows={skills.map((skill, i) => ({
              code: `EBP 0${i + 1}`,
              skill,
              featured: i === 0,
            }))}
            destination={t("board.destination")}
            destinationValue={t("board.destinationValue")}
          />
        </div>
      </Container>
    </section>
  );
}
