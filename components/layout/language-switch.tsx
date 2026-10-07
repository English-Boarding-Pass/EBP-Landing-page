"use client";

import { clsx } from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeLabels } from "@/i18n/routing";

export function LanguageSwitch({
  tone = "navy",
  compact = false,
  className,
}: {
  tone?: "navy" | "white";
  /** Short labels and tighter buttons, for the phone header. */
  compact?: boolean;
  className?: string;
}) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      role="group"
      aria-label={t("language")}
      className={clsx(
        "inline-flex items-center gap-0.5 rounded-full border p-0.5",
        tone === "white"
          ? "border-white/25 bg-white/10"
          : "border-navy/10 bg-paper",
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
              "rounded-full text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
              compact
                ? "min-h-10 px-1.5 min-[360px]:min-w-9 min-[360px]:px-2"
                : "min-h-11 px-3",
              active
                ? tone === "white"
                  ? "bg-white text-navy"
                  : "bg-navy text-white"
                : tone === "white"
                  ? "text-white hover:bg-white/10 focus-visible:ring-white"
                  : "text-slate hover:text-navy focus-visible:ring-navy",
            )}
          >
            {compact ? localeLabels[code].compact : localeLabels[code].native}
          </button>
        );
      })}
    </div>
  );
}
