import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageHero } from "@/components/sections/page-hero";
import { CorporatePillars } from "@/components/sections/corporate-pillars";
import { EnquiryForm } from "@/components/corporates/enquiry-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.corporates" });

  return pageMetadata({
    locale,
    path: "/corporates",
    title: t("title"),
    description: t("description"),
  });
}

// The page that QR codes and business proposals link straight to, so it has
// to make sense without the home page: the offer first, then its own form.
export default async function CorporatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("corporates");

  return (
    <main id="main-content">
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      >
        <Button href="#enquiry" variant="accent" size="lg">
          {t("cta")}
        </Button>
      </PageHero>

      <CorporatePillars />

      <section id="enquiry" className="bg-white py-14 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            title={t("form.title")}
            subtitle={t("form.subtitle")}
          />
          <EnquiryForm />
        </Container>
      </section>
    </main>
  );
}
