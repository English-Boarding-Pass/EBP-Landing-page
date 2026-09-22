"use client";

import { clsx } from "clsx";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeLabels } from "@/i18n/routing";

export function LanguageSwitch({
  tone = "navy",
  className,
}: {
  tone?: "navy" | "white";
  className?: string;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      role="group"
      aria-label="Language"
      className={clsx(
        "inline-flex items-center gap-0.5 rounded-full border p-0.5",
        tone === "white"
          ? "border-white/25 bg-white/10"
          : "border-navy/10 bg-white",
        className,
      )}
    >
      {locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            aria-pressed={active}
            aria-label={localeLabels[code].native}
            onClick={() => router.replace(pathname, { locale: code })}
            className={clsx(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2",
              active
                ? tone === "white"
                  ? "bg-white text-navy"
                  : "bg-navy text-white"
                : tone === "white"
                  ? "text-white/70 hover:text-white focus-visible:ring-white"
                  : "text-slate hover:text-navy focus-visible:ring-navy",
            )}
          >
            {localeLabels[code].native}
          </button>
        );
      })}
    </div>
  );
}
