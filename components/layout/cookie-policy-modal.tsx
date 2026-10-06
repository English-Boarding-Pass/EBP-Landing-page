"use client";

import type { RefObject } from "react";
import { useTranslations } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { PrivacyNotice } from "@/components/legal/privacy-notice";

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
    </Modal>
  );
}
