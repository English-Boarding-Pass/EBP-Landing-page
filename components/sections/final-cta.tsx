import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { ContactButton } from "@/components/contact/contact-dialog";

export function FinalCta() {
  const t = useTranslations("finalCta");

  return (
    <section className="relative overflow-hidden bg-navy py-20 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(156,204,246,0.16),transparent_55%)]"
      />
      <Container className="relative flex flex-col items-center gap-6 text-center">
        <h2 className="max-w-xl font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {t("title")}
        </h2>
        <p className="max-w-md text-base text-white/75">{t("subtitle")}</p>
        <ContactButton variant="accent" size="lg">
          {t("cta")}
        </ContactButton>
      </Container>
    </section>
  );
}
