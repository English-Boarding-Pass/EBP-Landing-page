"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { CookiePolicyModal } from "@/components/layout/cookie-policy-modal";

/** The footer's "Cookie policy" button. It opens the policy in a popup. */
export function CookiePolicyButton({ className }: { className?: string }) {
  const t = useTranslations("footer");
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
        {t("legal.cookies")}
      </button>
      <CookiePolicyModal
        open={open}
        onClose={() => setOpen(false)}
        returnFocusRef={triggerRef}
      />
    </>
  );
}
