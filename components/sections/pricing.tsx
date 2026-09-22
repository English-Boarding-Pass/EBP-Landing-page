import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

export function Pricing() {
  const t = useTranslations("pricing");

  return (
    <section id="pricing" className="bg-ice py-20 sm:py-28">
      <Container>
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mx-auto"
        />

        <div className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-card border border-navy/10 bg-white shadow-[0_1px_2px_rgba(11,25,86,0.04),0_12px_32px_-16px_rgba(11,25,86,0.18)]">
          <div className="flex flex-col items-center gap-6 p-8 text-center sm:p-12">
            <span className="inline-flex items-center rounded-full bg-sky/25 px-4 py-1.5 text-xs font-semibold tracking-[0.15em] text-sky-ink uppercase">
              {t("earlyBirdLabel")}
            </span>

            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
              <span className="font-display text-5xl font-extrabold tracking-tight text-navy sm:text-6xl">
                {t("earlyBirdPrice")}
              </span>
              <span className="flex items-center gap-2 text-lg text-slate">
                <span className="line-through decoration-slate/40">
                  {t("regularPrice")}
                </span>
                <span className="text-sm">{t("regularLabel")}</span>
              </span>
            </div>

            <Button
              href="/check-in"
              variant="primary"
              size="lg"
              className="mt-2"
            >
              {t("cta")}
            </Button>

            <p className="max-w-md text-xs leading-relaxed text-slate">
              {t("fine")}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
