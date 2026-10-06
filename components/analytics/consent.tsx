"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Cookie } from "iconoir-react";
import { Analytics } from "@vercel/analytics/next";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CookiePolicyModal } from "@/components/layout/cookie-policy-modal";
import { resetConsent, setConsent, useConsent } from "@/lib/consent";

/**
 * Loads analytics only after the visitor accepts, and shows the
 * Accept / Reject banner until they have chosen.
 */
export function Consent() {
  const t = useTranslations("consent");
  const consent = useConsent();
  const [policyOpen, setPolicyOpen] = useState(false);
  const policyRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      {consent === "accepted" ? <Analytics /> : null}
      {consent === "unset" ? (
        <section
          aria-label={t("title")}
          className="fixed inset-x-0 bottom-0 z-(--z-header) border-t border-navy/10 bg-paper shadow-float"
        >
          <Container className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div className="flex min-w-0 items-start gap-4 sm:items-center">
              <span
                aria-hidden
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-ice text-sky-ink"
              >
                <Cookie className="size-5" />
              </span>
              <p className="text-sm leading-relaxed text-slate">
                {t("body")}{" "}
                <button
                  ref={policyRef}
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => setPolicyOpen(true)}
                  className="rounded font-medium text-sky-ink underline underline-offset-4 hover:text-navy focus-visible:ring-2 focus-visible:ring-navy focus-visible:outline-none"
                >
                  {t("policyLink")}
                </button>
              </p>
            </div>
            {/* Same size and weight for both: choosing essential only is as easy as accepting all. */}
            <div className="flex shrink-0 gap-3">
              <Button
                type="button"
                variant="secondary"
                size="md"
                className="flex-1 sm:flex-none"
                onClick={() => setConsent("rejected")}
              >
                {t("essential")}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                className="flex-1 sm:flex-none"
                onClick={() => setConsent("accepted")}
              >
                {t("accept")}
              </Button>
            </div>
          </Container>
          {/* Outside the <p>: the popup is a dialog, which can't sit inside a paragraph. */}
          <CookiePolicyModal
            open={policyOpen}
            onClose={() => setPolicyOpen(false)}
            returnFocusRef={policyRef}
          />
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
