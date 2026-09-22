import { useTranslations } from "next-intl";
import { Calendar, Clock, GraduationCap, CheckCircle } from "iconoir-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { RouteCard } from "@/components/boarding-pass/route-card";
import { localeLabels } from "@/i18n/routing";
import { routeNativeCopy } from "@/lib/route-native-copy";

export function RoutesSection() {
  const t = useTranslations("routes");

  const sharedFacts = [
    {
      icon: <CheckCircle className="size-4" aria-hidden />,
      label: t("facts.classes"),
    },
    {
      icon: <Clock className="size-4" aria-hidden />,
      label: t("facts.frequency"),
    },
    {
      icon: <Calendar className="size-4" aria-hidden />,
      label: t("facts.duration"),
    },
    {
      icon: <GraduationCap className="size-4" aria-hidden />,
      label: t("facts.outcome"),
    },
  ];

  return (
    <section id="routes" className="bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow={t("sharedFactsLabel")}
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mx-auto"
        />
      </Container>

      {/* Wider than the standard container so a two-up ticket row has room to breathe. */}
      <div className="mx-auto mt-14 w-full max-w-[1480px] px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <RouteCard
            code={t("sinhala.code")}
            flagLabel={t("sinhala.flagLabel")}
            nativeWord={localeLabels.si.native}
            tagline={routeNativeCopy.sinhala.tagline}
            description={routeNativeCopy.sinhala.description}
            facts={sharedFacts}
            seatsRemaining={t.raw("sinhala.seats") as number}
            seatsLabel={t("seatsRemaining")}
            departsLabel={t("departsLabel")}
            departs={t("sinhala.departs")}
            ctaLabel={t("cta")}
            ctaHref="/check-in?route=sinhala"
          />
          <RouteCard
            code={t("tamil.code")}
            flagLabel={t("tamil.flagLabel")}
            nativeWord={localeLabels.ta.native}
            tagline={routeNativeCopy.tamil.tagline}
            description={routeNativeCopy.tamil.description}
            facts={sharedFacts}
            seatsRemaining={t.raw("tamil.seats") as number}
            seatsLabel={t("seatsRemaining")}
            departsLabel={t("departsLabel")}
            departs={t("tamil.departs")}
            ctaLabel={t("cta")}
            ctaHref="/check-in?route=tamil"
          />
        </div>
      </div>
    </section>
  );
}
