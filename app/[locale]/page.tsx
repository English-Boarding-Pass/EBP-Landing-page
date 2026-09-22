import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { RoutesSection } from "@/components/sections/routes-section";
import { Pricing } from "@/components/sections/pricing";
import { Testimonials } from "@/components/sections/testimonials";
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
    <>
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <RoutesSection />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <Teachers />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
