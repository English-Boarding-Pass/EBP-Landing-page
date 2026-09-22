"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, Xmark } from "iconoir-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { LanguageSwitch } from "@/components/layout/language-switch";

const navItems = [
  { href: "#how-it-works", key: "howItWorks" } as const,
  { href: "#routes", key: "routes" } as const,
  { href: "#pricing", key: "pricing" } as const,
  { href: "#teachers", key: "teachers" } as const,
  { href: "#faq", key: "faq" } as const,
];

export function SiteHeader() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-navy/95 backdrop-blur supports-[backdrop-filter]:bg-navy/90">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-navy"
      >
        {t("skipToContent")}
      </a>
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
        <a href="#top" aria-label="English Boarding Pass — home">
          <Logo variant="inverted" size="sm" showTagline={false} />
        </a>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-5 xl:flex"
        >
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="shrink-0 whitespace-nowrap font-body text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {t(item.key)}
            </a>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          <LanguageSwitch tone="white" />
          <Button href="/check-in" variant="accent" size="md">
            {t("bookSeat")}
          </Button>
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
      </Container>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-white/10 bg-navy xl:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 font-body text-base font-medium text-white/85 hover:bg-white/5 hover:text-white"
              >
                {t(item.key)}
              </a>
            ))}
            <div className="mt-2 flex items-center justify-between gap-3 px-3">
              <LanguageSwitch tone="white" />
            </div>
            <div className="mt-3 px-3">
              <Button
                href="/check-in"
                variant="accent"
                size="md"
                className="w-full"
              >
                {t("bookSeat")}
              </Button>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
