"use client";

import { useTranslations } from "next-intl";
import { Analytics } from "@vercel/analytics/next";
import { Button } from "@/components/ui/button";
import { PrivacyButton } from "@/components/layout/privacy-button";
import { resetConsent, setConsent, useConsent } from "@/lib/consent";

/**
 * Loads analytics only after the visitor accepts, and shows the
 * Accept / Reject banner until they have chosen.
 */
export function Consent() {
  const t = useTranslations("consent");
  const consent = useConsent();

  return (
    <>
      {consent === "accepted" ? <Analytics /> : null}
      {consent === "unset" ? (
        <section
          aria-label={t("title")}
          className="fixed inset-x-3 bottom-3 z-(--z-header) mx-auto max-w-3xl rounded-card border border-navy/10 bg-paper p-5 shadow-float sm:inset-x-6 sm:bottom-6 sm:p-6"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-base font-bold text-navy">
                {t("title")}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate">
                {t("body")}
              </p>
              {/* Outside the <p>: this button renders a popup, which can't sit inside a paragraph. */}
              <PrivacyButton className="mt-1 inline-flex min-h-11 items-center rounded text-sm font-medium text-sky-ink underline underline-offset-4 hover:text-navy focus-visible:ring-2 focus-visible:ring-navy focus-visible:outline-none" />
            </div>
            {/* Same size and weight for both: rejecting is as easy as accepting. */}
            <div className="flex shrink-0 gap-3">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setConsent("rejected")}
              >
                {t("reject")}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => setConsent("accepted")}
              >
                {t("accept")}
              </Button>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

/** Footer button that reopens the banner so a choice can be changed. */
export function ConsentSettingsButton({ className }: { className?: string }) {
  const t = useTranslations("consent");
  return (
    <button type="button" onClick={resetConsent} className={className}>
      {t("settings")}
    </button>
  );
}
