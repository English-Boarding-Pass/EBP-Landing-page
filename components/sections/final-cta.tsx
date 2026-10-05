import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { ContactButton } from "@/components/contact/contact-dialog";

export function FinalCta() {
  const t = useTranslations("finalCta");

  return (
    <section className="bg-navy py-16 sm:py-24">
      <Container className="grid items-end gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          <h2 className="max-w-xl font-display text-[clamp(1.875rem,1.4rem+2vw,2.25rem)] font-extrabold tracking-tight text-white">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-md text-base text-white/75">
            {t("subtitle")}
          </p>
        </div>
        <div className="lg:justify-self-end">
          <ContactButton variant="accent" size="lg">
            {t("cta")}
          </ContactButton>
        </div>
      </Container>
    </section>
  );
}
