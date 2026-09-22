import { useTranslations } from "next-intl";
import { CheckCircle } from "iconoir-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { DepartureBoard } from "@/components/boarding-pass/departure-board";

export function Hero() {
  const t = useTranslations("hero");
  const tRoutes = useTranslations("routes");

  const trustPoints = t.raw("trustPoints") as string[];

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
          <p className="font-board text-xs font-semibold tracking-[0.25em] text-sky uppercase">
            {t("eyebrow")}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            {t("subtitle")}
          </p>

          {/*
            Always a vertical stack, on every breakpoint and every locale.
            Sinhala/Tamil CTA labels run noticeably longer than English, so
            letting this flip between a row and a wrapped stack depending on
            whether the pair fits made the hero visibly reflow when the
            language switched. A fixed structure keeps the page feeling the
            same shape across languages — it grows a little taller for
            longer translations, but it doesn't rearrange itself.
          */}
          <div className="mt-9 flex flex-col items-start gap-3">
            <Button href="/check-in" variant="accent" size="lg">
              {t("cta")}
            </Button>
            <Button href="#how-it-works" variant="outline-inverted" size="lg">
              {t("ctaSecondary")}
            </Button>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
            {trustPoints.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2 text-sm text-white/75"
              >
                <CheckCircle className="size-4 text-sky" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center lg:justify-end">
          <DepartureBoard
            label={t("board.label")}
            gate={t("board.gate")}
            gateValue={t("board.gateValue")}
            status={t("board.status")}
            statusValue={t("board.statusValue")}
            columns={{
              route: t("board.columns.route"),
              duration: t("board.columns.duration"),
              classes: t("board.columns.classes"),
              seats: t("board.columns.seats"),
            }}
            rows={[
              {
                code: tRoutes("sinhala.code"),
                route: tRoutes("sinhala.name"),
                duration: tRoutes("facts.duration"),
                classes: "40",
                seats: tRoutes.raw("sinhala.seats") as number,
              },
              {
                code: tRoutes("tamil.code"),
                route: tRoutes("tamil.name"),
                duration: tRoutes("facts.duration"),
                classes: "40",
                seats: tRoutes.raw("tamil.seats") as number,
              },
            ]}
          />
        </div>
      </Container>
    </section>
  );
}
