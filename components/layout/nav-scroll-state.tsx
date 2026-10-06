"use client";

import { useEffect } from "react";

/**
 * Marks the nav as scrolled once the page has moved about 8px, so CSS can give
 * the glass pill a stronger edge. No scroll listener and no React state: an
 * IntersectionObserver watches a 1px sentinel at the very top of the page and
 * the result goes onto the nav as a data attribute.
 */
export function NavScrollState() {
  useEffect(() => {
    const sentinel = document.getElementById("nav-scroll-sentinel");
    const nav = document.getElementById("site-nav");
    if (!sentinel || !nav) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        nav.dataset.scrolled = entry.isIntersecting ? "false" : "true";
      },
      // The extra 8px of root margin keeps the sentinel "visible" until the
      // page has scrolled that far.
      { rootMargin: "8px 0px 0px 0px" },
    );
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      delete nav.dataset.scrolled;
    };
  }, []);

  return (
    <div
      id="nav-scroll-sentinel"
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 h-px w-px"
    />
  );
}
