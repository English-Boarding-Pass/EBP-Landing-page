import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/sections/page-hero";
import { ScienceSkills } from "@/components/sections/science-skills";
import { ScienceCefr } from "@/components/sections/science-cefr";
import { ScienceProgression } from "@/components/sections/science-progression";
import { FinalCta } from "@/components/sections/final-cta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.science" });

  return pageMetadata({
    locale,
    path: "/science",
    title: t("title"),
    description: t("description"),
  });
}

// Three elements in a deliberate order: what there is to improve, how it is
// measured, then how we build it in class.
export default async function SciencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("science");

  return (
    <main id="main-content">
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <ScienceSkills />
      <ScienceCefr />
      <ScienceProgression />
      <FinalCta />
    </main>
  );
}
