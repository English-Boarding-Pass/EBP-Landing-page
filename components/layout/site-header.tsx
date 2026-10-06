"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { Menu, Xmark } from "iconoir-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { ContactButton } from "@/components/contact/contact-dialog";
import { LanguageSwitch } from "@/components/layout/language-switch";
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

  // Lock page scroll while the mobile menu is open. scrollbar-gutter: stable
  // (global CSS) keeps the page from shifting when the scrollbar goes.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, [open]);

  // Tamil labels run wide, so Tamil keeps the hamburger until 2xl. Written out
  // in full so Tailwind can see every class.
  const inlineNav =
    locale === "ta"
      ? { show: "2xl:flex", block: "2xl:block", hide: "2xl:hidden" }
      : { show: "xl:flex", block: "xl:block", hide: "xl:hidden" };

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
    <header className="sticky top-0 z-(--z-header) border-b border-navy/10 bg-navy/95 backdrop-blur supports-[backdrop-filter]:bg-navy/90">
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

        <nav
          aria-label="Primary"
          className={clsx("hidden items-center gap-5", inlineNav.show)}
        >
          {renderLinks(desktopLink)}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          {/* Much of the audience can't read the English nav, so the language choice is always on screen: in the bar from sm up, in its own row on phones. */}
          <div className="hidden sm:block">
            <LanguageSwitch tone="white" />
          </div>
          <div className={clsx("hidden", inlineNav.block)}>
            <ContactButton source="header" variant="accent" size="md">
              {t("cta")}
            </ContactButton>
          </div>
          <button
            type="button"
            className={
              "inline-flex size-10 shrink-0 items-center justify-center rounded-full text-white " +
              inlineNav.hide
            }
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

      <div className="flex justify-center border-t border-white/10 py-2 sm:hidden">
        <LanguageSwitch tone="white" />
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className={clsx("border-t border-white/10 bg-navy", inlineNav.hide)}
        >
          <Container className="flex flex-col gap-1 py-4">
            {renderLinks(mobileLink, () => setOpen(false))}
            <div className="mt-3 px-3">
              <ContactButton
                source="mobile_menu"
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
