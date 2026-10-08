import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Consent } from "@/components/analytics/consent";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { SITE_URL } from "@/lib/site";
import { SiteHeader } from "@/components/layout/site-header";
import { NavScrollState } from "@/components/layout/nav-scroll-state";
import { SiteFooter } from "@/components/layout/site-footer";
import { BackToTop } from "@/components/layout/back-to-top";
import { ContactProvider } from "@/components/contact/contact-dialog";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  // Pages add their own canonical address, language links and share tags
  // (lib/seo.ts); these are the fallbacks, e.g. for the not-found page.
  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    // Browser extensions often add attributes to <html> before React loads;
    // this silences that one-level mismatch without hiding real ones below.
    <html
      lang={locale}
      dir="ltr"
      data-scroll-behavior="smooth"
      className={fontVariables}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-ivory font-body text-navy antialiased">
        <NextIntlClientProvider>
          <ContactProvider>
            <NavScrollState />
            <SiteHeader />
            {children}
            <SiteFooter />
            <BackToTop />
          </ContactProvider>
          <Consent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
