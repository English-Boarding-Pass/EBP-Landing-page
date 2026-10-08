"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { useTranslations } from "next-intl";
import { NavArrowUp } from "iconoir-react";
import { usePathname } from "@/i18n/navigation";
import { useConsent } from "@/lib/consent";

/**
 * A round button in the bottom corner that takes the visitor back to the top
 * of the page. It appears once the page's first section (the hero) has
 * scrolled out of view. No scroll listener: an IntersectionObserver watches
 * that section, the same approach as NavScrollState.
 */
export function BackToTop() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const consent = useConsent();
  const [past, setPast] = useState(false);

  // Re-attach on every page change: each page has its own first section.
  useEffect(() => {
    const first = document.querySelector("main > section");
    if (!first) return;
    const observer = new IntersectionObserver(([entry]) => {
      // Only "past" when the section has left through the top, not when the
      // page is simply short.
      setPast(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(first);
    return () => observer.disconnect();
  }, [pathname]);

  // The cookie banner sits along the bottom until the visitor chooses, so the
  // button waits for it to go rather than covering it.
  const shown = past && (consent === "accepted" || consent === "rejected");

  return (
    <button
      type="button"
      aria-label={t("backToTop")}
      onClick={() => {
        // Smooth or instant follows the visitor's motion setting (globals.css).
        window.scrollTo({ top: 0 });
        // Keyboard focus would otherwise stay on this button as it hides;
        // move it to the logo link at the top instead.
        document
          .querySelector<HTMLElement>("#site-nav a")
          ?.focus({ preventScroll: true });
      }}
      className={clsx(
        "fixed right-4 bottom-4 z-40 inline-flex size-12 items-center justify-center rounded-full border border-white/20 bg-navy text-white shadow-float hover:bg-slate focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-offset-2 focus-visible:ring-offset-ivory focus-visible:outline-none sm:right-6 sm:bottom-6",
        "motion-safe:transition-[opacity,transform,visibility] motion-safe:duration-200",
        // `invisible` also takes the hidden button out of the tab order.
        shown ? "visible opacity-100" : "invisible translate-y-2 opacity-0",
      )}
    >
      <NavArrowUp className="size-6" aria-hidden />
    </button>
  );
}
