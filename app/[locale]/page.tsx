import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Teachers } from "@/components/sections/teachers";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/seo";
import { organizationData, websiteData } from "@/lib/structured-data";

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

  // Who we are, for search engines (lib/structured-data.ts).
  const organization = organizationData(locale, tMeta("description"));
  const website = websiteData(locale);

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
      <JsonLd data={website} />
      <JsonLd data={faq} />
      <Hero />
      <HowItWorks />
      <Teachers />
      <Faq />
      <FinalCta />
    </main>
  );
}
