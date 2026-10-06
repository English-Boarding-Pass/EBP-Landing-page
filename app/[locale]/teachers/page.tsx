import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ContactButton } from "@/components/contact/contact-dialog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.teachers" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

// The full directory is not ready yet, so this page says so and points to the
// two things that work today: the sample profiles and a direct enquiry.
export default async function TeachersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("teachersPage");

  return (
    <main id="main-content">
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <section className="bg-ivory py-16 sm:py-28">
        <Container>
          <div className="max-w-2xl rounded-card border border-navy/10 bg-paper p-7 sm:p-9">
            <h2 className="font-display text-2xl font-extrabold text-navy">
              {t("soonTitle")}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate">
              {t("soonBody")}
            </p>
            <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button href="/#teachers" variant="secondary" size="md">
                {t("seeSample")}
              </Button>
              <ContactButton variant="primary" size="md">
                {t("ask")}
              </ContactButton>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
