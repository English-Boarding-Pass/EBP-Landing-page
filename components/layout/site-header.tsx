"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { Menu, Whatsapp, Xmark } from "iconoir-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { LanguageSwitch } from "@/components/layout/language-switch";
import { Link } from "@/i18n/navigation";
import { whatsappUrl } from "@/lib/site";

// `page` items are their own routes; `section` items are anchors on the home page.
const navItems = [
  { key: "howItWorks", section: "how-it-works" },
  { key: "programmes", section: "programmes" },
  { key: "corporates", page: "/corporates" },
  { key: "science", page: "/science" },
  { key: "teachers", section: "teachers" },
  { key: "faq", section: "faq" },
] as const;

export function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  // Tamil labels run wide, so Tamil keeps the hamburger until 2xl. Written out
  // in full so Tailwind can see every class.
  const inlineNav =
    locale === "ta"
      ? { show: "2xl:flex", block: "2xl:block", hide: "2xl:hidden" }
      : { show: "xl:flex", block: "xl:block", hide: "xl:hidden" };

  const desktopLink =
    "inline-flex min-h-11 shrink-0 items-center font-body text-sm font-medium whitespace-nowrap text-white/80 transition-colors hover:text-white";
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
    // Zero-height sticky shell: the floating pill overlaps the top of the page
    // instead of pushing it down, so the first section runs right to the top.
    <header className="pointer-events-none sticky top-0 z-50 h-0">
      <a
        href="#main-content"
        className="pointer-events-auto sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-paper focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-navy"
      >
        {t("skipToContent")}
      </a>
      <div
        className={clsx(
          "mx-auto max-w-7xl px-3 pt-3 sm:px-5",
          locale === "ta" && "2xl:max-w-[88rem]",
        )}
      >
        <div className="pointer-events-auto relative rounded-[1.75rem] border border-white/10 bg-board/95 shadow-float backdrop-blur sm:rounded-full">
          {/*
            Tall enough for the full logo lockup (wordmark, tagline and bar)
            with room to spare, and padded away from the pill's curved ends
            so nothing looks clipped.
          */}
          <div className="flex min-h-16 items-center justify-between gap-4 py-2.5 pr-2 pl-5 sm:min-h-20 sm:py-3 sm:pl-9">
            <Link
              href="/"
              aria-label="English Boarding Pass, home"
              className="shrink-0"
            >
              <Logo
                variant="inverted"
                size="sm"
                taglineClassName="hidden sm:block"
              />
            </Link>

            <nav
              aria-label="Primary"
              className={clsx("hidden items-center gap-4", inlineNav.show)}
            >
              {renderLinks(desktopLink)}
            </nav>

            <div className="flex shrink-0 items-center gap-3">
              {/*
                The language choice has to be on screen from the first second:
                much of the audience can't read the English nav. From `sm` up
                it sits in the bar; on phones it gets its own row below.
              */}
              <div className="hidden sm:block">
                <LanguageSwitch tone="white" />
              </div>
              <div className={clsx("hidden", inlineNav.block)}>
                <Button href={whatsappUrl} variant="accent" size="md">
                  <Whatsapp className="size-4" aria-hidden />
                  {t("cta")}
                </Button>
              </div>
              <button
                type="button"
                className={
                  "inline-flex size-11 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/10 " +
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
          </div>

          <div className="flex justify-center border-t border-white/10 py-2 sm:hidden">
            <LanguageSwitch tone="white" />
          </div>
        </div>

        {open ? (
          <div
            id="mobile-nav"
            className={clsx(
              "pointer-events-auto mt-2 flex flex-col gap-1 rounded-[1.75rem] border border-white/10 bg-board p-3 shadow-float",
              inlineNav.hide,
            )}
          >
            {renderLinks(mobileLink, () => setOpen(false))}
            <div className="mt-2 px-1 pb-1">
              <Button
                href={whatsappUrl}
                variant="accent"
                size="md"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                <Whatsapp className="size-4" aria-hidden />
                {t("cta")}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
