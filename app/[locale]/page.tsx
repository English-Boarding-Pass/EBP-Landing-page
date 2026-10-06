import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Programmes } from "@/components/sections/programmes";
import { Teachers } from "@/components/sections/teachers";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main-content">
      <Hero />
      <HowItWorks />
      <Teachers />
      <Programmes />
      <Faq />
      <FinalCta />
    </main>
  );
}
