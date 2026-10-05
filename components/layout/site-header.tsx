"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Menu, Xmark } from "iconoir-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { LanguageSwitch } from "@/components/layout/language-switch";
import { ContactButton } from "@/components/contact/contact-dialog";
import { Link } from "@/i18n/navigation";

// `page` items are their own routes; `section` items are anchors on the home page.
const navItems = [
  { key: "howItWorks", section: "how-it-works" },
  { key: "corporates", page: "/corporates" },
  { key: "science", page: "/science" },
  { key: "teachers", section: "teachers" },
  { key: "faq", section: "faq" },
] as const;

export function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const desktopLink =
    "shrink-0 font-body text-sm font-medium whitespace-nowrap text-white/80 transition-colors hover:text-white";
  const mobileLink =
    "rounded-lg px-3 py-2.5 font-body text-base font-medium text-white/85 hover:bg-white/5 hover:text-white";

  function renderLinks(className: string, onClick?: () => void) {
    return navItems.map((item) =>
      "page" in item ? (
        <Link
          key={item.key}
          href={item.page}
          onClick={onClick}
          className={className}
        >
          {t(item.key)}
        </Link>
      ) : (
        // A plain anchor: it scrolls in place on the home page and loads the
        // home page at that section from anywhere else.
        <a
          key={item.key}
          href={`/${locale}#${item.section}`}
          onClick={onClick}
          className={className}
        >
          {t(item.key)}
        </a>
      ),
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-navy/95 backdrop-blur supports-[backdrop-filter]:bg-navy/90">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-navy"
      >
        {t("skipToContent")}
      </a>
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link href="/" aria-label="English Boarding Pass, home">
          <Logo
            variant="inverted"
            size="sm"
            taglineClassName="hidden sm:block"
          />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-5 xl:flex">
          {renderLinks(desktopLink)}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          {/*
            The language choice has to be on screen from the first second:
            much of the audience can't read the English nav. From `sm` up it
            sits in the bar; on phones it gets its own row below.
          */}
          <div className="hidden sm:block">
            <LanguageSwitch tone="white" />
          </div>
          <div className="hidden xl:block">
            <ContactButton variant="accent" size="md">
              {t("cta")}
            </ContactButton>
          </div>
          <button
            type="button"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-white xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <Xmark className="size-6" aria-hidden />
            ) : (
              <Menu className="size-6" aria-hidden />
            )}
          </button>
        </div>
      </Container>

      <div className="border-t border-white/10 sm:hidden">
        <Container className="flex justify-center py-2">
          <LanguageSwitch tone="white" />
        </Container>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-white/10 bg-navy xl:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            {renderLinks(mobileLink, () => setOpen(false))}
            <div className="mt-3 px-3">
              <ContactButton
                variant="accent"
                size="md"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                {t("cta")}
              </ContactButton>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
