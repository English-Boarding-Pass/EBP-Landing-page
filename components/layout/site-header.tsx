"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { Menu, Xmark } from "iconoir-react";
import { Logo } from "@/components/brand/logo";
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
    "inline-flex min-h-11 shrink-0 items-center font-body text-sm font-medium whitespace-nowrap text-white/85 transition-colors hover:text-white";
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
    <header className="pointer-events-none sticky top-0 z-(--z-header) h-0">
      <a
        href="#main-content"
        className="pointer-events-auto sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-paper focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-navy"
      >
        {t("skipToContent")}
      </a>
      <div
        className={clsx(
          "mx-auto max-w-[88rem] px-2 pt-3 sm:px-4",
          locale === "ta" && "2xl:max-w-[96rem]",
        )}
      >
        <div
          id="site-nav"
          className="nav-glass pointer-events-auto relative rounded-[1.75rem] sm:rounded-full"
        >
          {/* Tall enough for the full logo lockup, and padded away from the pill's curved ends so nothing looks clipped. */}
          <div
            className={clsx(
              // The pill reaches further out, but its content keeps its old
              // width and stays centred, so the logo and button don't move.
              "mx-auto flex min-h-16 w-full max-w-[77.5rem] items-center justify-between gap-4 py-2.5 pr-2 pl-5 sm:min-h-20 sm:py-3 sm:pr-3 sm:pl-9",
              locale === "ta" && "2xl:max-w-[85.5rem]",
            )}
          >
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
              "nav-glass nav-glass-sheet pointer-events-auto mt-2 flex flex-col gap-1 rounded-[1.75rem] p-3",
              inlineNav.hide,
            )}
          >
            {renderLinks(mobileLink, () => setOpen(false))}
            <div className="mt-2 px-1 pb-1">
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
          </div>
        ) : null}
      </div>
    </header>
  );
}
