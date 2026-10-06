"use client";

import type { RefObject } from "react";
import { useTranslations } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { PrivacyNotice } from "@/components/legal/privacy-notice";
import { Button } from "@/components/ui/button";
import { resetConsent, useConsent } from "@/lib/consent";

/** The Cookie Policy popup. It reuses the privacy notice's layout. */
export function CookiePolicyModal({
  open,
  onClose,
  returnFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}) {
  const t = useTranslations("cookiePolicy");
  const consent = useConsent();
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("title")}
      description={t("subtitle")}
      closeLabel={t("close")}
      size="2xl"
      returnFocusRef={returnFocusRef}
    >
      <PrivacyNotice namespace="cookiePolicy" />
      {/* Once a choice is made the bar is gone, so this is the way to change it. */}
      {consent === "accepted" || consent === "rejected" ? (
        <Button
          type="button"
          variant="secondary"
          size="md"
          className="mt-8"
          onClick={() => {
            resetConsent();
            onClose();
          }}
        >
          {t("changeChoice")}
        </Button>
      ) : null}
    </Modal>
  );
}
