import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
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

  return {
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
      className={fontVariables}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-ivory font-body text-navy antialiased">
        <NextIntlClientProvider>
          <ContactProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
          </ContactProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
