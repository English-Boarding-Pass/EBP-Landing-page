import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Teachers } from "@/components/sections/teachers";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { socialLinks } from "@/lib/links";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

type FaqItem = { question: string; answer: string; points?: string[] };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return pageMetadata({
    locale,
    path: "",
    title: t("title"),
    description: t("description"),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tMeta = await getTranslations("meta");
  const tFaq = await getTranslations("faq");

  // Who we are, for search engines. No phone or email until the real ones exist.
  const organization = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "English Boarding Pass",
    url: `${SITE_URL}/${locale}`,
    description: tMeta("description"),
    areaServed: { "@type": "Country", name: "Sri Lanka" },
    sameAs: socialLinks.map((link) => link.href),
  };

  // The same questions and answers the FAQ section shows on the page.
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (tFaq.raw("items") as FaqItem[]).map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: [item.answer, ...(item.points ?? [])].join(" "),
      },
    })),
  };

  return (
    <main id="main-content">
      <JsonLd data={organization} />
      <JsonLd data={faq} />
      <Hero />
      <HowItWorks />
      <Teachers />
      <Faq />
      <FinalCta />
    </main>
  );
}
