"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { PrivacyNotice } from "@/components/legal/privacy-notice";

/** The footer's "Privacy notice" button. It opens the notice in a popup. */
export function PrivacyButton({ className }: { className?: string }) {
  const t = useTranslations("privacy");
  const tFooter = useTranslations("footer");
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className={className}
      >
        {tFooter("legal.privacy")}
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t("title")}
        description={t("subtitle")}
        closeLabel={t("close")}
        size="2xl"
        returnFocusRef={triggerRef}
      >
        <PrivacyNotice />
      </Modal>
    </>
  );
}
